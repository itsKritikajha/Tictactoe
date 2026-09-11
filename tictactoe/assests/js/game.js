class TwoPlayer{
    constructor(){
        this.#addEventListeners();
    }

    #addEventListeners(){
        const cells = document.querySelectorAll('.cell');
        const message = document.querySelector('.message p');
        const reset = document.getElementById('reset');
        let mode = 'x';
        cells.forEach(cell => {
            cell.addEventListener('click',()=>{
                const idx = Array.from(cells).indexOf(cell);
                if(cell.textContent === ''){
                    blocks[idx] = mode;
                    cell.textContent = mode;
                    cell.classList.add(mode);
                    mode = mode === 'x' ? 'o' : 'x';
                    message.innerHTML = `Player ${mode.toUpperCase()}'s turn`;
                }
            })
        })
    }
}