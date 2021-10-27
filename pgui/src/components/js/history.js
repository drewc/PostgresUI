export function getServersHistory() {
    let servHist = localStorage.getItem('servers');
    if (servHist) {
        servHist = JSON.parse(servHist)
    } else {
        servHist = []
    }

    return servHist
}


export function setServersHistoryItem(server) {
    const sstr = JSON.stringify(server);
    const sstrs = getServersHistory().map(JSON.stringify)
    const newsstrs = [...sstrs.filter(s => { if (s !== sstr) {return s} }), sstr];
    const newHist = [...newsstrs].map(JSON.parse);
    localStorage.setItem('servers', JSON.stringify(newHist));

    return newHist;
}
