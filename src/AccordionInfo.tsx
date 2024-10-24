import { useState } from "react";
import { AccordionInfoType } from "./@types/componentTypes";

const AccordionInfo: React.FC<AccordionInfoType> = ({title, content, icon}) => {
    const [opened, setOpened] = useState(false);

    return (
        <div className={`accordion accordion-block ${opened ? 'accordion-open' : ''}`}>
            <div className="accordion-header" onClick={e => setOpened(!opened)}>
                {typeof title === 'string' ? <h2>{title}</h2> : title}
                <span className="dashicons dashicons-arrow-down-alt2" style={{rotate: opened ? '180deg' : '0deg'}}></span>
            </div>
            <div className="accordion-body" style={{height: opened ? 'max-content' : '0px'}}>
                {typeof content === 'string' ? <p>{content}</p> : content}
            </div>
        </div>
    );
};

export default AccordionInfo;