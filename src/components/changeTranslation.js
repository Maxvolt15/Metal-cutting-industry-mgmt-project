import React, { useState, useContext } from "react";
import itImage from './icons/it.gif'
import enImage from './icons/uk.gif'
import { translation as itTranslation } from "../asset/italian";
import { translation as enTranslation } from "../asset/english";
import { TranslationContext } from "../hooks/translation";
const languagesSupported = [
    {
        lang: itTranslation,
        icon: itImage
    },
    {
        lang: enTranslation,
        icon: enImage
    },
]
function ChangeTranslation({ show, setShow }) {
    const [language, setLanguage] = useState(languagesSupported[0])
    const { setTranslation } = useContext(TranslationContext)
    const toggleLanguages = () => {
        setShow((oldShow) => !oldShow);
    };
    return (
        <div className="notification-wrapper" style={{ cursor: "pointer" }} >
            <img src={language.icon} width={40} height={20} alt='Spain flag' onClick={toggleLanguages} />
            <div className="translation-dropdown" hidden={!show}>
                {languagesSupported.map((ls, index) => (
                    <div role="button" onClick={() => {
                        setLanguage(ls)
                        setTranslation(ls.lang)
                    }}>
                        <img src={ls.icon} width={40} height={20} alt='Spain flag' />
                        {index + 1 < languagesSupported.length ? (
                            <div className="separator" />
                        ) : null}
                    </div>
                ))}
            </div>
        </div>
    )
}
//                    
export default ChangeTranslation