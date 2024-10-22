export const InfoText: React.FC = () => {

    return (
        <>
            <div className="ctp-blank-separator"></div>

            <div className="wrap info-box flex-col">
                <h2>Come usare questo plugin?</h2>
                
                <p>Inserisci il testo o la stringa che desideri tradurre nella colonna di sinistra (nome colonna: 'Stringa da tradurre').</p>

                <p>Successivamente inserisci la traduzione che desideri applicare alla stringa sulla colonna di sinistra (nome colonna: 'Traduzione in italiano').</p>

                <p>Per ora c'è scritto 'Traduzione in italiano', ma in realtà puoi mettere la traduzione in qualsiasi lingua vuoi, quindi nella lingua attuale del tuo sito o di quella che desideri.</p>

                <p><strong>Attualmente NON sono disponibili le traduzioni per siti multi-lingua</strong>. Questa funzionalità verrà implementata nelle versioni successive. In futuro per ogni stringa da tradurre (sulla colonna di sinistra) avrai tutte le lingue che desideri sulla colonna di destra (con un menù a tendina selezionabile)</p>

                <p>Anche la funzionalità di traduzione automatica è in fase di sviluppo e attualmente non è disponibile al pubblico.</p>

                <p><small>Da Michele Mincone - 22 Ottobre 2024 18:48 pm</small></p>

                <div className="separator"></div>

                <h2>Come funziona?</h2>

                <p>Questo plugin usa il filtro 'gettext' di WordPress per sostituire le strighe con la traduzione che desideri visualizzare.</p>

                <p>Può capitare che alcuni plugin non riescano a tradurre alcune parti e/o strighe del sito (del tema o dei plugin che stai utilizzando).</p>

                <p>Attraverso Custom Translations Plugin utilizzerai uno strumento differente per applicare le tue traduzioni.</p>
            </div>
        </>
    )
}
