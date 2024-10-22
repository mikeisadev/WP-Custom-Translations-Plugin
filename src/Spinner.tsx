import { SpinnerType } from "./@types/componentTypes";

const Spinner: React.FC<SpinnerType> = ({title, classes}) => {
    return (
        <div className={`spinner-box ${classes}`}>
            <div className="spinner is-active"></div> 
            <p>{title}</p>
        </div>
    );
};

export default Spinner;