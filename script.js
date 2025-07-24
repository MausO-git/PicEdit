const imgs = document.querySelectorAll('.zone .draggableImg');
let isDragging = false;
let resazing = false;
let rotating = false;
let offsetX, offsetY;
let movedX, movedY;
let resize
let rotate

const zone = document.querySelector('.zone');
const topL = document.querySelector('#buttonZone .topL');
const topR = document.querySelector('#buttonZone .topR');
const botR = document.querySelector('#buttonZone .botR');
const botL = document.querySelector('#buttonZone .botL');
const centerPos = document.querySelector('#buttonZone .center');
const zonewidth = zone.clientWidth;
const zoneHeight = zone.clientHeight;

const motionButton = (posX, posY, index)=>{
    const clicked = document.querySelector('.zone .draggableImg.clicked');
    if(!clicked) return;

    sessionStorage.setItem(`x${index}`, posX);
    sessionStorage.setItem(`y${index}`, posY);

    clicked.style.left = posX + 'px';
    clicked.style.top = posY + 'px';
}

topL.addEventListener('click', ()=>{
    const clicked = document.querySelector('.zone .draggableImg.clicked');
    if(!clicked) return;
    const index = [...imgs].indexOf(clicked);
    const zonerRect = zone.getBoundingClientRect();

    motionButton(zonerRect.left, zonerRect.top, index)
})

topR.addEventListener('click', ()=>{
    const clicked = document.querySelector('.zone .draggableImg.clicked');
    if(!clicked) return;
    const index = [...imgs].indexOf(clicked);
    const zonerRect = zone.getBoundingClientRect();

    motionButton(zonerRect.left + zonewidth - clicked.offsetWidth, zonerRect.top, index);
})

botL.addEventListener('click', ()=>{
    const clicked = document.querySelector('.zone .draggableImg.clicked');
    if(!clicked) return;
    const index = [...imgs].indexOf(clicked);
    const zonerRect = zone.getBoundingClientRect();

    motionButton(zonerRect.left, zonerRect.top + zoneHeight - clicked.offsetHeight, index);
})

botR.addEventListener('click', ()=>{
    const clicked = document.querySelector('.zone .draggableImg.clicked');
    if(!clicked) return;
    const index = [...imgs].indexOf(clicked);
    const zonerRect = zone.getBoundingClientRect();

    motionButton(zonerRect.left + zonewidth - clicked.offsetWidth, zonerRect.top + zoneHeight - clicked.offsetHeight, index);
})

centerPos.addEventListener('click', ()=>{
    const clicked = document.querySelector('.zone .draggableImg.clicked');
    if(!clicked) return;
    const index = [...imgs].indexOf(clicked);
    const zonerRect = zone.getBoundingClientRect();

    motionButton(zonerRect.left + zonewidth/2 - clicked.offsetWidth/2, zonerRect.top + zoneHeight/2 - clicked.offsetHeight/2, index);
})


imgs.forEach((img, index) =>{
    const i = img.querySelector('.rot');
    if(sessionStorage.getItem(`x${index}`) !== null){
        img.style.left = sessionStorage.getItem(`x${index}`) + 'px';
        img.style.top = sessionStorage.getItem(`y${index}`) + 'px';
    }

    if(sessionStorage.getItem(`width${index}`) !== null){
        img.style.width = sessionStorage.getItem(`width${index}`) + 'px';
        img.style.height = sessionStorage.getItem(`height${index}`) + 'px';
    }

    if(sessionStorage.getItem(`angle${index}`) !== null){
        i.style.transform = `rotate(${sessionStorage.getItem(`angle${index}`)}deg)`
    }

    img.setAttribute('transfo', false)
    img.addEventListener('click', ()=>{
        const zonerRect = zone.getBoundingClientRect();
        imgs.forEach(otherImg =>{
            if(otherImg !== img){
                otherImg.classList.remove('clicked');
                otherImg.setAttribute('transfo', false);
            }
        })
        img.classList.add('clicked');
        img.setAttribute('transfo', true);
        resize = document.querySelector('.resize');
        rotate = document.querySelector('.rotate')

        resize.addEventListener('mousedown', (e)=>{
            resazing = true;
        })

        resize.addEventListener('mousemove', (e)=>{
            const rect = img.getBoundingClientRect();
            isDragging = false;
            if(resazing){
                const newWidth = (e.clientX > zonerRect.right) ? (zonerRect.right - rect.left) : (e.clientX - rect.left);
                
                const newHeight = (e.clientY > zonerRect.bottom) ? zonerRect.bottom - rect.top : e.clientY - rect.top;

                sessionStorage.setItem(`width${index}`, newWidth);
                sessionStorage.setItem(`height${index}`, newHeight)

                img.style.width = newWidth + 'px'
                img.style.height = newHeight + 'px'
            }
        })

        rotate.addEventListener('mousedown', (e)=>{
            rotating = true;
        })

        rotate.addEventListener('mousemove', (e)=>{
            isDragging = false;
            const i = img.querySelector('.rot')
            if (rotating) {
                const rect = img.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
                const angleDeg = (angle * (180 / Math.PI)) - 90;

                sessionStorage.setItem(`angle${index}`, angleDeg)

                i.style.transform = `rotate(${angleDeg}deg)`;
            }

        })

        document.addEventListener('mouseup', (e)=>{
            resazing = false;
            rotating = false;
        })
    })

    img.addEventListener('mousedown', (e)=>{
        if(img.classList.contains('clicked')){
            isDragging = true;
            img.style.cursor = "grabbing";
    
            // Décalage entre la position du clic et le coin de l'image
            const rect = img.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
        }
    })

    document.addEventListener("mousemove", (e) => {
        const rect = img.getBoundingClientRect();
        const zonerRect = zone.getBoundingClientRect();
        if (isDragging) {
            movedX = e.clientX - offsetX;
            movedY = e.clientY - offsetY;

            if(movedX < zonerRect.left){
                movedX = zonerRect.left;
            }else if(movedX > zonerRect.left + zonewidth - img.offsetWidth){
                movedX = zonerRect.left + zonewidth - img.offsetWidth;
            }

            if(movedY < zonerRect.top) movedY = zonerRect.top;
            if(movedY > zonerRect.top + zoneHeight - img.offsetHeight){
                movedY = zonerRect.top + zoneHeight - img.offsetHeight;
            }

            sessionStorage.setItem(`x${index}`, movedX)
            sessionStorage.setItem(`y${index}`, movedY)

            img.style.left = movedX + "px";
            img.style.top = movedY + "px";
        }
    });

    document.addEventListener("mouseup", () => {
        if(img.classList.contains('clicked')){
            isDragging = false;
            img.style.cursor = "grab";
        }
    });

    img.addEventListener('dblclick', ()=>{
        img.classList.remove('clicked');
        img.setAttribute('transfo', false);
        img.style.cursor = ''
    })

    img.ondragstart = () => false;
})

