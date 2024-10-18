import ReactDOM from "react-dom";
import { ModalType } from "./@types/componentTypes";

const Modal: React.FC<ModalType> | null = ({title, show, onClose, children}) => {
    if (!show) return null;

    const modal = (
        <div className='ctp-modal-wrap'>
            <div className="ctp-modal">
                <div className="modal-header">
                    <h2>{title}</h2>
                    <span className="close-modal" onClick={onClose}>
                        <span className="dashicons dashicons-no-alt"></span>
                    </span>
                </div>
                <div className="modal-body">
                    { children }
                </div>
            </div>
            <div className="ctp-modal-overlay"></div>
        </div>
    );

    return ReactDOM.createPortal(
        modal, 
        document.body
    );
};

export default Modal;