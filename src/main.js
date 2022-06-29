// Reccomeded way of calling $(document).ready()
$(() => {

// For getting the image in focus. 
$.fn.getFurthestRightChild = function() {
    let furthestRight = -Infinity
    let furthestRightChild = null
    this.children().each((i, e) => {
        const element = $(e);
        const offsetLeft = element.position().left
        if (offsetLeft > furthestRight) {
            furthestRight = offsetLeft
            furthestRightChild = element
        }
    })
    return furthestRightChild
}

// For getting the image that is about to enter focus.
$.fn.getFurthestLeftChild = function() {
    let furthestLeft = Infinity
    let furthestLeftChild = null
    this.children().each((i, e) => {
        const element = $(e);
        const offsetLeft = element.position().left
        if (offsetLeft < furthestLeft) {
            furthestLeft = offsetLeft
            furthestLeftChild = element
        }
    })
    return furthestLeftChild
}

// Here because '.css()' returns value in pixels.
$.fn.getStyleRight = function() {
    return this[0].style.right || "0"
}

const arrowLeft = $("#arrow-left")
const arrowRight = $("#arrow-right")
const sliderRows = $(".slider-row-inner")

const variables = $("#variables")
const sliderImageGap = parseInt(variables.css("--slider-image-gap"))
const sliderTransitionDuration = parseFloat(variables.css("--slider-transition-duration"))

// Used so the user cannot click the arrows while the slider is moving.
let sliderWait = false

const moveSlider = (left = false) => {
    if (sliderWait) return
    const direction = left ? 1 : -1
    sliderWait = true
    sliderRows.each((i, e) => {
        const row = $(e);

        // If slider is moving left, the last image must come before the first.
        if (left) {
            const firstImg = row.getFurthestLeftChild()
            const imgRight = firstImg.getStyleRight()
            firstImg.css("right", `${parseInt(imgRight) - 100}%`)
        }

        // The entire row is moved for the width of the last image plus the gap.
        const lastImage = row.getFurthestRightChild()
        const moveBy = (lastImage.width() + sliderImageGap) * direction
        const rowRight = row.css("right");
        row.css("right", `${parseInt(rowRight) + moveBy}px`)

        // If slider is moving right, the image which left the focus must come to the begging of the row.
        if (!left) setTimeout(() => {
            const imgRight = lastImage.getStyleRight();
            lastImage.css("right", `${parseInt(imgRight) + 100}%`)
        }, sliderTransitionDuration * 1000)
    })
    setTimeout(() => { sliderWait = false }, sliderTransitionDuration * 1000)
}

arrowLeft.on("click", () => moveSlider(true))
arrowRight.on("click", () => moveSlider())

})