import { SpinnerType } from "./@types/componentTypes";

const Spinner: React.FC<SpinnerType> = ({title}) => {
    return (
        <div className="spinner-box">
            <div className="spinner is-active"></div> 
            <p>{title}</p>
        </div>
    );
};

export default Spinner;