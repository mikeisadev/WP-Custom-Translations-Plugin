import ReactDOM from "react-dom";
import { useState, useEffect } from "react";
import { ToastMessageType } from "./@types/componentTypes";
import { colors } from "./utils/colors";

const ToastNotice: React.FC<ToastMessageType> = ({
    message,
    timeout,
    onToastClose,
    status
}) => {
    if ( !document.body.querySelector('.ctp-toast-messages') ) {
        document.body.insertAdjacentHTML('beforeend', '<div class="ctp-toast-messages"></div>');
    }

    const [show, setShow] = useState(true);

    useEffect(() => {
        setShow(true);
    }, []);

    const onClose = () => {
        setShow(false);
        onToastClose();
    };

    function triggerAutoClose() {
        setTimeout(() => {
            setShow(false);
            onToastClose();
        }, timeout || 5000);
    }

    const toast = () => {

        return (
            <>
                <div 
                    className={`ctp-toast ctp-toast-${status ? 'opened' : 'closed'}`}
                    style={{borderColor: colors[status].color}}
                >
                    <p>{message}</p>
                    <button onClick={onClose} className="close-toast">
                        <span className="dashicons dashicons-no-alt"></span>
                    </button>
                </div>
                {triggerAutoClose()}
            </>
        )
    };

    if (!show) return null;

    return ReactDOM.createPortal(toast(), document.body.querySelector('.ctp-toast-messages') as Element);   
};

export default ToastNotice;