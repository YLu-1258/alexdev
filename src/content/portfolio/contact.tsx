import React from "react";

const Contacts: React.FC = () => {
    const aboutData = import(`./about.json`);
    return (
        <div>
            <h1>Contacts</h1>
        </div>
    );
}

export default Contacts;