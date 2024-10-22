const colors: {[key: string]: {color: string, icon: string | HTMLSpanElement}} = 
{
    'info': {
        'color': '#0000FF',
        'icon': '<span className="dashicons dashicons-info-outline"></span>'
    },
    'warning': {
        'color': '#FFA500',
        'icon': '<span className="dashicons dashicons-warning"></span>'
    },
    'error': {
        'color': '#FF0000',
        'icon': '<span className="dashicons dashicons-no-alt"></span>'
    },
    'success' : {
        'color': '#008000',
        'icon': '<span className="dashicons dashicons-saved"></span>'
    },
}

export {
    colors
}