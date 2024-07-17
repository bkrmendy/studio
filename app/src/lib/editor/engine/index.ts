import { makeAutoObservable } from 'mobx';
import { CodeManager } from './code';
import { OverlayManager } from './overlay';
import { EditorElementState } from './state';
import { WebviewManager } from './webviews';
import { WebviewChannels } from '/common/constants';
import { Action, UpdateStyleAction, History } from '/common/history';
import { ElementMetadata } from '/common/models';

export enum EditorMode {
    Design = 'Design',
    Interact = 'Interact',
}

export class EditorEngine {
    private elementState: EditorElementState = new EditorElementState();
    private overlayManager: OverlayManager = new OverlayManager();
    private webviewManager: WebviewManager = new WebviewManager();
    private codeManager: CodeManager = new CodeManager(this.webviewManager);
    private history: History = new History();
    private editorMode: EditorMode = EditorMode.Design;
    public scale: number = 0;

    constructor() {
        makeAutoObservable(this);
    }

    get state() {
        return this.elementState;
    }
    get overlay() {
        return this.overlayManager;
    }
    get webviews() {
        return this.webviewManager;
    }
    get code() {
        return this.codeManager;
    }
    get mode() {
        return this.editorMode;
    }

    set mode(mode: EditorMode) {
        this.clear();
        this.editorMode = mode;
    }

    private updateStyle(targets: UpdateStyleAction['targets'], style: string, value: string) {
        targets.forEach((elementMetadata) => {
            const webview = this.webviews.get(elementMetadata.webviewId);
            if (!webview) {
                return;
            }
            webview.send(WebviewChannels.UPDATE_STYLE, {
                selector: elementMetadata.selector,
                style: style,
                value: value,
            });
        });
    }

    private dispatchAction(action: Action) {
        switch (action.type) {
            case 'update-style':
                this.updateStyle(action.targets, action.style, action.change.updated);
        }
    }

    runAction(action: Action) {
        this.history.push(action);
        this.dispatchAction(action);
    }

    startTransaction() {
        this.history.startTransaction();
    }

    commitTransaction() {
        this.history.commitTransaction();
    }

    undo() {
        const action = this.history.undo();
        if (action == null) {
            return;
        }

        this.dispatchAction(action);
    }

    mouseover(els: ElementMetadata[], webview: Electron.WebviewTag) {
        if (!els.length) {
            this.overlay.removeHoverRect();
            this.state.clearHoveredElement();
            return;
        }

        const el = els[0];
        const adjustedRect = this.overlay.adaptRectFromSourceElement(el.rect, webview);
        this.overlay.updateHoverRect(adjustedRect);
        this.state.setHoveredElement(el);
    }

    click(els: ElementMetadata[], webview: Electron.WebviewTag) {
        this.overlay.removeClickedRects();
        this.state.clearSelectedElements();

        for (const el of els) {
            const adjustedRect = this.overlay.adaptRectFromSourceElement(el.rect, webview);
            this.overlay.addClickRect(adjustedRect, el.computedStyle);
            this.state.addSelectedElement(el);
        }
    }

    scroll(webview: Electron.WebviewTag) {
        this.refreshClickedElements(webview);
    }

    handleStyleUpdated(webview: Electron.WebviewTag) {
        this.refreshClickedElements(webview);
    }

    refreshClickedElements(webview: Electron.WebviewTag) {
        this.overlay.clear();
        const clickedElements = this.state.selected;
        clickedElements.forEach(async (element) => {
            const rect = await this.overlay.getBoundingRect(element.selector, webview);
            const computedStyle = await this.overlay.getComputedStyle(element.selector, webview);
            const adjustedRect = this.overlay.adaptRectFromSourceElement(rect, webview);
            this.overlay.addClickRect(adjustedRect, computedStyle);
        });
    }

    dispose() {
        this.clear();
        this.webviews.deregisterAll();
    }

    clear() {
        this.overlay.clear();
        this.state.clear();
    }
}
