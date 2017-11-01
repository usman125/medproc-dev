import {
    DynamicFormControlModel,
    DynamicCheckboxModel,
    DynamicInputModel,
    DynamicRadioGroupModel
} from "@ng2-dynamic-forms/core";


   export const MY_FORM_MODEL: DynamicFormControlModel[] = [

    new DynamicInputModel({

        id: "exampleInput",
        label: "Example Input",
        maxLength: 42,
        placeholder: "example input"
    }),
    new DynamicInputModel({

        id: "exampleInputFile",
        label: "Example Input File",
        maxLength: 42,
        inputType:"file",
        placeholder: "example input"
    }),

    new DynamicRadioGroupModel<string>({

        id: "exampleRadioGroup",
        label: "Example Radio Group",
        options: [
            {
                label: "Option 1",
                value: "option-1",
            },
            {
                label: "Option 2",
                value: "option-2"
            },
            {
                label: "Option 3",
                value: "option-3"
            }
        ],
        value: "option-3"
    }),
    new DynamicRadioGroupModel<string>({

        id: "exampleRadioGroup2",
        label: "Example Radio Group 2",
        options: [
            {
                label: "Option 1",
                value: "option-1",
            },
            {
                label: "Option 2",
                value: "option-2"
            },
            {
                label: "Option 3",
                value: "option-3"
            }
        ],
        value: "option-3"
    }),

    new DynamicCheckboxModel({

        id: "exampleCheckbox",
        label: "I do agree"
    })
];