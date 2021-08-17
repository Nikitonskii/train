import React, { useState, useLayoutEffect } from "react";

import "./SignUpStyles.scss";

import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { ButtonTypes } from "../../components/Button/types";

import { config } from "./config";

import { Fields, ValidationFields, ConfigItem } from "./types";

import * as utils from "../../utils";

const SignUp: React.FC = (): JSX.Element => {
  const [success, setSuccess] = useState<boolean>(false);
  const [formFields, setFormFields] = useState<Fields>({});
  const [isFieldsValid, setIsFieldsValid] = useState<ValidationFields>({});

  useLayoutEffect(() => {
    const fields: Fields = {};
    const validationVars: ValidationFields = {};

    config.forEach((field: ConfigItem) => {
      const { name } = field;

      if (field.isRequired) {
        fields[name] = "";
        validationVars[name] = false;
      } else {
        fields[name] = "";
      }
    });

    setFormFields(fields);
    setIsFieldsValid(validationVars);
  }, []);

  const onChangeFieldsValue = (e: any) => {
    const { name, value } = e.target;

    setFormFields({
      ...formFields,
      [name]: value,
    });
  };

  const isValidationError = (config: ConfigItem[]): boolean => {
    const state: ValidationFields = {};
    let fields = [];
    config.forEach((field: ConfigItem) => {
      if (field.isRequired) {
        state[field.name] = false;
      }
    });

    fields = [...Object.keys(state)];
    fields.forEach((field) => {
      if (field === "email") {
        state[field] = !utils.regExEmail.test(formFields[field]);
      } else {
        state[field] = !formFields[field].length;
      }
    });

    setIsFieldsValid(state);

    return [...Object.values(state)].includes(true);
  };

  const makeFakeRequest = () => {
    const checkResult = isValidationError(config);

    if (!checkResult) {
      setTimeout(() => setSuccess(true), 1000);
    }
  };

  const closePopup = () => setSuccess(false);

  return (
    <div className="sign-up-container">
      <form className="sign-up-form" onSubmit={() => {}}>
        {config.map((item: ConfigItem) => (
          <Input
            key={item.name}
            name={item.name}
            type={item.type}
            label={item.label}
            isError={isFieldsValid[item.name]}
            onAction={onChangeFieldsValue}
            isRequired={item.isRequired}
            placeholder={item.placeholder}
            errorText={item.errorText}
            passwordType={item.passwordType}
          />
        ))}
        <Button
          title="Send"
          onAction={makeFakeRequest}
          buttonType={ButtonTypes.button}
        />
      </form>
      {success && (
        <div className="sign-up-popup">
          <h3>Congrat Champ !! you did it</h3>
          <Button
            buttonType={ButtonTypes.button}
            onAction={closePopup}
            title="close me"
          />
        </div>
      )}
    </div>
  );
};

export default SignUp;