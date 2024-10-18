import { FeedbackTextType } from './@types/componentTypes';

const FeedbackText: React.FC<FeedbackTextType> = ({text, status}) => {
    const themes = {
        'info': {
            'color': '#0000FF',
            'icon': <span className="dashicons dashicons-info-outline"></span>
        },
        'warning': {
            'color': '#FFA500',
            'icon': <span className="dashicons dashicons-warning"></span>
        },
        'error': {
            'color': '#FF0000',
            'icon': <span className="dashicons dashicons-no-alt"></span>
        },
        'success' : {
            'color': '#008000',
            'icon': <span className="dashicons dashicons-saved"></span> 
        },
    }

    return (
        <div className='wrap info-box'>
            <span style={{color: themes[status].color}}>
                { themes[status].icon }
            </span>
            <p>{text}</p>
        </div>
    );
};

export default FeedbackText;