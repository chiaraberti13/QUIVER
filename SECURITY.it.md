# Ambito della sicurezza e segnalazioni

[English](SECURITY.md) · [Italiano](SECURITY.it.md) · [Documentazione](docs/README.it.md)

## Ambito attuale

QUIVER è nelle prime fasi di sviluppo. Non sono state annunciate release o
versioni di produzione supportate. Scaffold e regole di lint non forniscono uno
scanner di skill, una sandbox per agenti o un modello di permessi verificato.
Vedi lo [stato dello sviluppo](docs/presentation/development-status.it.md).

Il progetto di sicurezza copre skill non attendibili, accesso a filesystem e
processi, confini di rete, segreti, permessi dei provider e audit in
[project.md Parte B](project.md#part-b--security) e
[Parte C](project.md#part-c--secure-coding-standard). Sono requisiti da
implementare e verificare, non garanzie già disponibili.

## Segnalare una possibile vulnerabilità

Il canale previsto è la segnalazione privata delle vulnerabilità di GitHub,
come specificato in project.md §25. Questa pagina non ne conferma l'attivazione.

1. Apri la [scheda Security](https://github.com/chiaraberti13/QUIVER/security)
   del repository. Usa **Report a vulnerability** se la segnalazione privata è disponibile.
2. Altrimenti, contatta chi mantiene il progetto attraverso un canale privato
   già conosciuto. Se non ne esiste uno, apri una issue senza dati sensibili
   chiedendo un canale privato, senza descrivere la vulnerabilità.
3. Nella segnalazione privata indica commit, componente, impatto, passaggi
   riproducibili ed evidenze anonimizzate. Non includere credenziali reali.

Tempi di risposta, contatto privato confermato e politica delle versioni
supportate restano parte del task P0-T017. Qui non viene promesso un tempo di
risposta. Per problemi nelle dipendenze indica versione coinvolta e uso in QUIVER.

## Confini dei contributi

Le modifiche rilevanti per la sicurezza seguono lo standard di codice e le
revisioni dei percorsi protetti descritti in [CONTRIBUTING.it.md](CONTRIBUTING.it.md).
Errori di documentazione, traduzione o link possono usare issue pubbliche quando
non divulgano dettagli sensibili.
