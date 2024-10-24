import AccordionInfo from "./AccordionInfo"

export const InfoText: React.FC = () => {

    return (
        <>
            <div className="ctp-blank-separator"></div>

            <div className="wrap info-box flex-col accordion-list">
                <h2>Informazioni utili</h2>

                <AccordionInfo
                    title={
                        <h2>Come usare questo plugin?</h2>
                    }
                    content={
                        <div className="text-wrap">
                            <p>Inserisci il testo o la stringa che desideri tradurre nella colonna di sinistra (nome colonna: 'Stringa da tradurre').</p>
    
                            <p>Successivamente inserisci la traduzione che desideri applicare alla stringa sulla colonna di sinistra (nome colonna: 'Traduzione in italiano').</p>
    
                            <p>Per ora c'è scritto 'Traduzione in italiano', ma in realtà puoi mettere la traduzione in qualsiasi lingua vuoi, quindi nella lingua attuale del tuo sito o di quella che desideri.</p>
    
                            <p><strong>Attualmente NON sono disponibili le traduzioni per siti multi-lingua</strong>. Questa funzionalità verrà implementata nelle versioni successive. In futuro per ogni stringa da tradurre (sulla colonna di sinistra) avrai tutte le lingue che desideri sulla colonna di destra (con un menù a tendina selezionabile)</p>
    
                            <p>Anche la funzionalità di traduzione automatica è in fase di sviluppo e attualmente non è disponibile al pubblico.</p>
    
                            <p><small>Da Michele Mincone - 22 Ottobre 2024 18:48 pm</small></p>
                        </div> 
                    }
                />
                            
                <AccordionInfo
                    title={
                        <h2>Come funziona?</h2>
                    }
                    content={
                        <div className="text-wrap">
                            <p>Questo plugin usa il filtro 'gettext' di WordPress per sostituire le strighe con la traduzione che desideri visualizzare.</p>

                            <p>Può capitare che alcuni plugin non riescano a tradurre alcune parti e/o strighe del sito (del tema o dei plugin che stai utilizzando).</p>

                            <p>Attraverso Custom Translations Plugin utilizzerai uno strumento differente per applicare le tue traduzioni.</p>
                        </div>
                    }
                />

                <AccordionInfo
                    title={
                        <h2>Tradurre stringhe plurali e singolari</h2>
                    }
                    content={
                        <div className="text-wrap">
                            <p>Quando inserisci una stringa di testo per effettuare una traduzione, verrà usato il filtro <strong>gettext</strong> per cercare la stringa da tradurre a applicare la traduzione che hai inserito.</p>

                            <p>In questo caso le stringhe che traduci sono inserite di default con la funzione di wordpress: <strong>__()</strong>.</p>

                            <p>Ma ci sono stringhe, che in base al conteggio di un array di elementi, possono essere mostrate in versione singolare o plurale tramite la funzione <strong>_n()</strong>.</p>

                            <p>Queste stringhe possono essere filtrate e tradotte usando il filtro <strong>ngettext</strong> e non con <strong>gettext</strong>.</p>

                            <p>Per cui, se vuoi tradurre questo tipo di stringhe devi usare questo tipo di sintassi sia nella colonna della stringa da tradurre sia nella colonna in cui applichi la traduzione:</p>

                            <ul>
                                <li><strong>Stringa da tradurre: </strong>%_ctp_n(singular: "Stringa al singolare da tradurre", plural: "Stringa al plurale da tradurre")</li>
                                <li><strong>Traduzione: </strong>%_ctp_n(singular: "Traduzione stringa al singolare", plural: "Traduzione stringa al plurale")</li>
                            </ul>

                            <p>La sintassi da seguire deve essere quella indicata negli esempi, quindi: </p>

                            <ul>
                                <li>Inizia scrivendo: <strong>%_ctp_n</strong></li>
                                <li>Poi le parentesi tonde: <strong>%_ctp_n()</strong></li>
                                <li>Indica poi i parametri <em>singular:</em> e <em>plural:</em> dentro le parentesi separate dalla virgola: <strong>%_ctp_n(singular: , plural: )</strong></li>
                                <li>Dopo ogni parametro aggiungi la stringa singolare e plurale tra i doppi apici (<strong>NON USARE QUELLI SINGOLI</strong>): <strong>%_ctp_n(singular: "stringa singolare", plural: "stringa plurale")</strong></li>
                            </ul>

                            <p>Se non rispetterai questa sintassi la traduzione non verrà applicata.</p>

                            <p>Ricordati di iniziare con <strong>%_ctp_n()</strong>, di definire i parametri <strong>singular:</strong> e <strong>plural:</strong> e di inserire le rispettive stringhe tra <strong>doppi apici</strong> ("") e <strong>NON singoli</strong>.</p>

                            <p>Ricordati che la funzione deve essere inserita in entrambe le colonne: <em>in quella di sinistra (stringa da tradurre) per individuare le stringhe da prendere in considerazione, in quella di destra per applicare la traduzione desiderata</em></p>

                            <p>Se non la inserirai in entrambe le colonne la traduzione non verrà applicata.</p>
                        </div>
                    }
                />
            </div>
        </>
    )
}
