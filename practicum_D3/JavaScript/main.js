document.addEventListener("DOMContentLoaded", function() {
    const width = 600;
    const height = 600;      
    const svg = d3.select("svg")
        .attr("width", width)
        .attr("height", height);

    const enableAnimationCheckbox = document.getElementById("enableAnimation");
    const animationSettings = document.getElementById("animationSettings");
    const drawButton = document.getElementById("drawButton");
    const animateButton = document.getElementById("animateButton");
    const enablePathMovementCheckbox = document.getElementById("enablePathMovement");
    const coordinatesSettings = document.getElementById("coordinatesSettings");
    const pathSettings = document.getElementById("pathSettings");
    const pathMovementSettings = document.getElementById("pathMovementSettings");
    const animationCoordinatesSettings = document.getElementById("animationCoordinatesSettings");
    const drawSettings = document.getElementById("drawSettings");
    const animationTransformSettings = document.getElementById("animationTransformSettings");
    const animationTypeSettings = document.getElementById("animationTypeSettings");

    enableAnimationCheckbox.addEventListener("change", function() {
        if (this.checked) {
            animationSettings.style.display = "block";
            pathMovementSettings.style.display = "block";
            drawButton.style.display = "none";
            animateButton.style.display = "inline";
        } else {
            animationSettings.style.display = "none";
            pathMovementSettings.style.display = "none";
            drawButton.style.display = "inline";
            animateButton.style.display = "none";
            enablePathMovementCheckbox.checked = false;
            coordinatesSettings.style.display = "block";
            animationCoordinatesSettings.style.display = "block";
            drawSettings.style.display = "block";
            animationTransformSettings.style.display = "block";
            animationTypeSettings.style.display = "block";
            pathSettings.style.display = "none";
        }
    });

    enablePathMovementCheckbox.addEventListener("change", function() {
        if (this.checked) {
            coordinatesSettings.style.display = "none";
            animationCoordinatesSettings.style.display = "none";
            drawSettings.style.display = "none";
            animationTransformSettings.style.display = "none";
            pathSettings.style.display = "block";
            animationTypeSettings.style.display = "block";
        } else {
            coordinatesSettings.style.display = "block";
            animationCoordinatesSettings.style.display = "block";
            drawSettings.style.display = "block";
            animationTransformSettings.style.display = "block";
            pathSettings.style.display = "none";
            animationTypeSettings.style.display = "block";
        }
    });

    drawButton.addEventListener("click", function() {
        const form = document.getElementById("setting");
        draw(form);
    });

    animateButton.addEventListener("click", function() {
        const form = document.getElementById("setting");
        runAnimation(form);
    });

    const clearButton = document.getElementById("clearButton");
    clearButton.addEventListener("click", function() {
        const svg = d3.select("svg");
        svg.selectAll('*').remove();
    });
});

let draw = (dataForm) => {
    const svg = d3.select("svg");
    let pict = drawSmile(svg);
    pict.attr("transform", `translate(${dataForm.cx.value}, 
                                      ${dataForm.cy.value}) 
                            scale(${dataForm.scaleX.value}, 
                                  ${dataForm.scaleY.value}) 
                            rotate(${dataForm.rotate.value})`);
};

let runAnimation = (dataForm) => {
    const svg = d3.select("svg");
    let pict = drawSmile(svg);

    const animationType = dataForm.animationType.value;
    let easeFunction;
    switch (animationType) {
        case "linear":
            easeFunction = d3.easeLinear;
            break;
        case "elastic":
            easeFunction = d3.easeElastic;
            break;
        case "bounce":
            easeFunction = d3.easeBounce;
            break;
        default:
            easeFunction = d3.easeLinear;
    }

    if (!dataForm.enablePathMovement.checked) {
        pict.attr("transform", `translate(${dataForm.cx.value}, 
                                          ${dataForm.cy.value}) 
                                scale(${dataForm.scaleX.value}, 
                                      ${dataForm.scaleY.value}) 
                                rotate(${dataForm.rotate.value})`)
            .transition()
            .duration(6000)
            .ease(easeFunction)
            .attr("transform", `translate(${dataForm.cx_finish.value}, 
                                          ${dataForm.cy_finish.value}) 
                                scale(${dataForm.scaleX_finish.value}, 
                                      ${dataForm.scaleY_finish.value}) 
                                rotate(${dataForm.rotate_finish.value})`);
    } else {
        let path = drawPath(dataForm.pathType.value);
        pict.transition()
            .ease(easeFunction)
            .duration(6000)
            .attrTween('transform', translateAlong(path.node()));
    }
};