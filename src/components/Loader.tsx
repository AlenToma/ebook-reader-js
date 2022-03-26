import * as React from 'react';
import '../loader.css';


export default ({ isLoading }: { isLoading: boolean }) => {

    if (!isLoading)
        return null;
    return (
        <React.Fragment>
            <div className='lds-spinner-blur'></div>
            <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </React.Fragment>

    )
}