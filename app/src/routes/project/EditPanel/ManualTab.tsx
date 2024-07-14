import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { getGroupedStyles } from '@/lib/editor/engine/styles/group';
import {
    ElementStyle,
    ElementStyleSubGroup,
    ElementStyleType,
} from '@/lib/editor/engine/styles/models';
import { observer } from 'mobx-react-lite';
import { useEditorEngine } from '..';
import AutoLayoutInput from './inputs/AutoLayoutInput';
import BorderInput from './inputs/BorderInput';
import ColorInput from './inputs/ColorInput';
import DisplayInput from './inputs/DisplayInput';
import NestedInputs from './inputs/NestedInputs';
import NumberUnitInput from './inputs/NumberUnitInput';
import SelectInput from './inputs/SelectInput';
import TagDetails from './inputs/TagDetails';
import TextInput from './inputs/TextInput';
import { UpdateStyleAction } from '/common/history';

const ManualTab = observer(() => {
    const editorEngine = useEditorEngine();
    const custom = 'Custom';
    const selectedEl =
        editorEngine.state.selected.length > 0 ? editorEngine.state.selected[0] : null;
    const computedStyle = selectedEl?.computedStyle ?? ({} as CSSStyleDeclaration);
    const parentRect = selectedEl?.parentRect ?? ({} as DOMRect);

    const groupedStyles = getGroupedStyles(computedStyle as CSSStyleDeclaration);

    // TODO: UpdateStyleAction['targets']
    const updateElementStyle = (elementStyle: ElementStyle) => (style: string, updated: string) => {
        const targets: UpdateStyleAction['targets'] = editorEngine.state.selected.map((s) => ({
            webviewId: s.webviewId,
            selector: s.selector,
        }));
        editorEngine.runAction({
            type: 'update-style',
            targets: targets,
            style: style,
            change: { original: elementStyle.value, updated: updated },
        });
    };

    function getSingleInput(elementStyle: ElementStyle) {
        if (elementStyle.type === ElementStyleType.Select) {
            return (
                <SelectInput elementStyle={elementStyle} updateElementStyle={updateElementStyle} />
            );
        } else if (elementStyle.type === ElementStyleType.Dimensions) {
            return (
                <AutoLayoutInput
                    parentRect={parentRect}
                    computedStyle={computedStyle}
                    elementStyle={elementStyle}
                    updateElementStyle={updateElementStyle(elementStyle)}
                />
            );
        } else if (elementStyle.type === ElementStyleType.Color) {
            return (
                <ColorInput
                    elementStyle={elementStyle}
                    updateElementStyle={updateElementStyle(elementStyle)}
                />
            );
        } else if (elementStyle.type === ElementStyleType.Number) {
            return (
                <NumberUnitInput
                    elementStyle={elementStyle}
                    updateElementStyle={updateElementStyle(elementStyle)}
                />
            );
        } else {
            return (
                <TextInput
                    elementStyle={elementStyle}
                    updateElementStyle={updateElementStyle(elementStyle)}
                />
            );
        }
    }

    function getNestedInput(elementStyles: ElementStyle[], subGroupKey: ElementStyleSubGroup) {
        if (
            [
                ElementStyleSubGroup.Margin,
                ElementStyleSubGroup.Padding,
                ElementStyleSubGroup.Corners,
            ].includes(subGroupKey as ElementStyleSubGroup)
        ) {
            return (
                <NestedInputs
                    elementStyles={elementStyles}
                    updateElementStyle={updateElementStyle(elementStyles[0])} // TODO: this needs a more general approach
                />
            );
        } else if (subGroupKey === ElementStyleSubGroup.Border) {
            return (
                <BorderInput
                    elementStyles={elementStyles}
                    updateElementStyle={updateElementStyle(elementStyles[0])} // TODO: this needs a more general approach
                />
            );
        } else if (subGroupKey === ElementStyleSubGroup.Display) {
            return (
                <DisplayInput
                    initialStyles={elementStyles}
                    updateElementStyle={updateElementStyle(elementStyles[0])} // TODO: this needs a more general approach
                />
            );
        } else {
            return elementStyles.map((elementStyle, i) => (
                <div className={`flex flex-row items-center ${i === 0 ? '' : 'mt-2'}`} key={i}>
                    <p className="text-xs w-24 mr-2 text-start opacity-60">
                        {elementStyle.displayName}
                    </p>
                    <div className="text-end ml-auto">{getSingleInput(elementStyle)}</div>
                </div>
            ));
        }
    }

    function renderGroupStyles(groupedStyles: Record<string, Record<string, ElementStyle[]>>) {
        return Object.entries(groupedStyles).map(([groupKey, subGroup]) => (
            <AccordionItem key={groupKey} value={groupKey}>
                <AccordionTrigger>
                    <h2 className="text-xs font-semibold">{groupKey}</h2>
                </AccordionTrigger>
                <AccordionContent>
                    {groupKey === 'Text' && (
                        <TagDetails tagName={editorEngine.state.selected[0].tagName} />
                    )}
                    {Object.entries(subGroup).map(([subGroupKey, elementStyles]) => (
                        <div key={subGroupKey}>
                            {getNestedInput(elementStyles, subGroupKey as ElementStyleSubGroup)}
                        </div>
                    ))}
                </AccordionContent>
            </AccordionItem>
        ));
    }

    return (
        editorEngine.state.selected.length > 0 && (
            <Accordion
                className="px-4"
                type="multiple"
                defaultValue={[...Object.keys(groupedStyles), custom]}
            >
                {renderGroupStyles(groupedStyles)}
            </Accordion>
        )
    );
});

export default ManualTab;
