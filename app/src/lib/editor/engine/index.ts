import { CodeManager } from './code';
import { OverlayManager } from './overlay';
import { EditorElementState } from './state';
import { WebviewManager } from './webviews';
import { WebviewChannels } from '/common/constants';
import { Action, UpdateStyleAction, History } from '/common/history';
import { ElementMetadata } from '/common/models';

export class EditorEngine {
    private elementState: EditorElementState = new EditorElementState();
    private overlayManager: OverlayManager = new OverlayManager();
    private webviewManager: WebviewManager = new WebviewManager();
    private codeManager: CodeManager = new CodeManager(this.webviewManager);
    private history: History = new History();

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

    private updateStyle(targets: UpdateStyleAction['targets'], style: string, value: string) {
        targets.forEach((elementMetadata) => {
            const webview = this.webviews.get(elementMetadata.webviewId);
            if (!webview) {
                return;
            }
            webview.send(WebviewChannels.UPDATE_STYLE, {
                selector: elementMetadata.selector,
                style,
                value,
            });
        });
    }

    runAction(action: Action) {
        this.history.push(action)

        switch (action.type) {
            case 'update-style':
                this.updateStyle(action.targets, action.style, action.value)
        }
    }

    undo() {
        const action = this.history.undo()
        if (action == null) {
            return
        }

        this.runAction(action)

    }

    mouseover(elementMetadata: ElementMetadata, webview: Electron.WebviewTag) {
        const adjustedRect = this.overlay.adaptRectFromSourceElement(elementMetadata.rect, webview);
        this.overlay.updateHoverRect(adjustedRect);
        this.state.setHoveredElement(elementMetadata);
    }

    click(elementMetadata: ElementMetadata, webview: Electron.WebviewTag) {
        const adjustedRect = this.overlay.adaptRectFromSourceElement(elementMetadata.rect, webview);
        this.overlay.removeClickedRects();
        this.overlay.addClickRect(adjustedRect, elementMetadata.computedStyle);
        this.state.clearSelectedElements();
        this.state.addSelectedElement(elementMetadata);
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
