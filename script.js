// Za dobivanje slike koja je u fokusu.
$.fn.getFurthestRightChild = function() {
    let furthestRight = -Infinity
    let furthestRightChild = null
    this.children().each(function() {
        const element = $(this);
        const offsetLeft = element.position().left
        if (offsetLeft > furthestRight) {
            furthestRight = offsetLeft
            furthestRightChild = element
        }
    })
    return furthestRightChild
}

// Za dobivanje slike koja ulazi u fokus ako se slider pomiče u lijevo.
$.fn.getFurthestLeftChild = function() {
    let furthestLeft = Infinity
    let furthestLeftChild = null
    this.children().each(function() {
        const element = $(this);
        const offsetLeft = element.position().left
        if (offsetLeft < furthestLeft) {
            furthestLeft = offsetLeft
            furthestLeftChild = element
        }
    })
    return furthestLeftChild
}

// Ovdje zato što .css() vraća iznos u pikselima, a ne postocima.
$.fn.getStyleRight = function() {
    return this[0].style.right || "0"
}

const sliderArrows = $("#slider-arrows > div")
const sliderRows = $(".slider-row-inner")

const root = $(":root")
const sliderImageGap = parseInt(root.css("--slider-image-gap"))
const sliderTransitionDuration = parseFloat(root.css("--slider-transition-duration"))

// Da korisnik ne može ići dalje dok tranzicija nije gotova.
let sliderWait = false

const moveSlider = (left = false) => {
    if (sliderWait) return
    const direction = left ? 1 : -1
    sliderWait = true
    sliderRows.each(function(){
        const row = $(this);

        // Ako se slider pomiče u lijevo, zadnja slika mora doći prije prve.
        if (left) {
            const firstImg = row.getFurthestLeftChild()
            const imgRight = firstImg.getStyleRight()
            firstImg.css("right", `${parseInt(imgRight) - 100}%`)
        }

        // Cijeli red sa slikama se pomiče za širinu zadnje slike zbrojenu sa razmakom.
        const lastImage = row.getFurthestRightChild()
        const moveBy = (lastImage.width() + sliderImageGap) * direction
        const rowRight = row.css("right");
        row.css("right", `${parseInt(rowRight) + moveBy}px`)

        // Ako se slider pomiče u desno, slika koja je izašla iz fokusa odlazi na početak.
        if (!left) setTimeout(() => {
            const imgRight = lastImage.getStyleRight();
            lastImage.css("right", `${parseInt(imgRight) + 100}%`)
        }, sliderTransitionDuration * 1000)
    })
    setTimeout(() => { sliderWait = false }, sliderTransitionDuration * 1000)
}

sliderArrows.first().click(() => moveSlider(true))
sliderArrows.last().click(() => moveSlider())