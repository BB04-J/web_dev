//
const addbtn = document.getElementById("addElement");
const fieldtype = document.getElementById("fieldtype");
const labelInput = document.getElementById("labelInput");
const preview = document.getElementById("formPreview");

let elements = [];

addbtn.addEventListener("click", function () {
    const selectedType = fieldtype.value;
    const labelText = labelInput.value.trim();
    if (!labelText) return; // ignore empty labels
    elements.push({ type: selectedType, label: labelText });
    render();
    labelInput.value = ""; // clear input
});

function render() {
    preview.innerHTML = "";
    elements.forEach(function (element, index) {
        const wrapper = document.createElement("div");
        wrapper.className = "field-row";

        const fieldContent = document.createElement("div");
        fieldContent.className = "field-content";

        const label = document.createElement("label");
        label.innerText = element.label;

        let input;
        if (element.type === "text") {
            input = document.createElement("input");
            input.type = "text";
        } else if (element.type === "checkbox") {
            input = document.createElement("input");
            input.type = "checkbox";
        } else if (element.type === "radio") {
            input = document.createElement("input");
            input.type = "radio";
            input.name = element.label;
        }

        fieldContent.appendChild(label);
        fieldContent.appendChild(input);

        const deleteBtn = document.createElement("button");
        deleteBtn.innerText = "Delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.addEventListener("click", function () {
            elements.splice(index, 1);
            render();
        });

        wrapper.appendChild(fieldContent);
        wrapper.appendChild(deleteBtn);
        preview.appendChild(wrapper);
    });
}

