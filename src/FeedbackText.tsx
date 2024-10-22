import { FeedbackTextType } from './@types/componentTypes';
import { colors } from './utils/colors';

const FeedbackText: React.FC<FeedbackTextType> = ({text, status}) => {

    return (
        <div className='wrap info-box'>
            <span 
                style={{color: colors[status].color}}
                dangerouslySetInnerHTML={{__html: colors[status].icon}}
            ></span>
            <p>{text}</p>
        </div>
    );
};

export default FeedbackText;