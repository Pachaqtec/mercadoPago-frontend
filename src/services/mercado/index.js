import React, { useEffect, useState } from "react";
import IMask from "imask";
import axios from "axios";
import "./style.css";

const initialState = {
    name: "",
    email: "",
    message: "",
    isopenSuccess: false,
    isopenError: false,
    isopenLoading: false,
};
const addCheckout = () => {
    // TEST-f6ed3063-76ee-4f42-9ed5-ba579fea7de1
    if (window.MercadoPago) {
        const mp = new window.MercadoPago("TEST-f6ed3063-76ee-4f42-9ed5-ba579fea7de1", {
            locale: "es-PE",
        });

        const cardForm = mp.cardForm({
            amount: "100.5",
            autoMount: true,
            form: {
                id: "form-checkout-assinatura",
                cardholderName: {
                    id: "form-checkout__cardholderName",
                    placeholder: "Titular",
                },
                cardholderEmail: {
                    id: "form-checkout__cardholderEmail",
                    placeholder: "E-mail",
                },
                cardNumber: {
                    id: "form-checkout__cardNumber",
                    placeholder: "Número de tarjeta",
                },
                cardExpirationMonth: {
                    id: "form-checkout__cardExpirationMonth",
                    placeholder: "Mes vencimiento",
                },
                cardExpirationYear: {
                    id: "form-checkout__cardExpirationYear",
                    placeholder: "Ano de vencimiento",
                },
                securityCode: {
                    id: "form-checkout__securityCode",
                    placeholder: "Código de seguridad",
                },
                installments: {
                    id: "form-checkout__installments",
                    placeholder: "Cuotas",
                },
                identificationType: {
                    id: "form-checkout__identificationType",
                    placeholder: "Tipo de documento",
                },
                identificationNumber: {
                    id: "form-checkout__identificationNumber",
                    placeholder: "Número do documento",
                },
                issuer: {
                    id: "form-checkout__issuer",
                    placeholder: "Banco emissor",
                },
            },
            callbacks: {
                onFormMounted: (error) => {
                    if (error) return console.log("Form Mounted handling error: ", error);
                    console.log("Form mounted");
                },
                onFormUnmounted: (error) => {
                    if (error)
                        return console.log("Form Unmounted handling error: ", error);
                    console.log("Form unmounted");
                },
                onIdentificationTypesReceived: (error, identificationTypes) => {
                    if (error)
                        return console.log("identificationTypes handling error: ", error);
                    console.log("Identification types available: ", identificationTypes);
                },
                onPaymentMethodsReceived: (error, paymentMethods) => {
                    if (error)
                        return console.log("paymentMethods handling error: ", error);
                    console.log("Payment Methods available: ", paymentMethods);
                },
                onIssuersReceived: (error, issuers) => {
                    if (error) return console.log("issuers handling error: ", error);
                    console.log("Issuers available: ", issuers);
                },
                onInstallmentsReceived: (error, installments) => {
                    if (error) return console.log("installments handling error: ", error);
                    console.log("Installments available: ", installments);
                },
                onCardTokenReceived: (error, token) => {
                    if (error) return console.log("Token handling error: ", error);
                    console.log("Token available: ", token);
                },
                onSubmit: (event) => {
                    event.preventDefault();

                    const {
                        paymentMethodId: payment_method_id,
                        issuerId: issuer_id,
                        cardholderEmail: email,
                        amount,
                        token,
                        installments,
                        identificationNumber,
                        identificationType,
                    } = cardForm.getCardFormData();

                    console.log("getCardFormData", {
                        paymentMethodId: payment_method_id,
                        issuerId: issuer_id,
                        cardholderEmail: email,
                        amount,
                        token,
                        installments,
                        identificationNumber,
                        identificationType,
                    });
                    const config = {
                        headers: {
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                        },
                    };
                    axios
                        .post(
                            "http://localhost:9000/api/pagar", {
                                amount,
                                paymentMethodId: payment_method_id,
                                issuerId: issuer_id,
                                cardholderEmail: email,
                                amount,
                                token,
                                installments,
                                identificationNumber,
                                identificationType,
                                email,
                            },
                            config
                        )
                        .then((response) => {
                            console.log("success", response);
                        })
                        .catch((error) => console.log("error", error));
                },
                onFetching: (resource) => {
                    console.log("Fetching resource: ", resource);
                },
            },
        });
    }
};

const Form = (props) => {
    const [atualiza, setAtualiza] = useState(true);
    const [ccnumber, setCcnumber] = useState("");
    const [identificationNumber, setIdentificationNumber] = useState("");
    const [
        { name, email, message, isopenSuccess, isopenError, isopenLoading },
        setState,
    ] = useState(initialState);

    const submitOpcoes = (event) => {
        setState({...initialState, ... { isopenLoading: true } });
        event.preventDefault();
        clearState("success");
    };

    const clearState = (type) => {
        let alert =
            type === "success" ? { isopenSuccess: true, isopenLoading: false } : { isopenError: true, isopenLoading: false };
        setState({...initialState, ...alert });
    };

    const handleCardNumber = (event) => {
        const value = event.target.value;
        console.log(value);

        let maskCustom = false;
        let maskedValue = "";
        let masked = "";

        maskCustom = {
            mask: "0000000000000000",
        };
        masked = IMask.createMask(maskCustom);
        maskedValue = masked.resolve(value);
        setCcnumber(maskedValue);
    };
    console.log(ccnumber);
    const handleCpf = (event) => {
        const value = event.target.value;
        let maskCustom = false;
        let maskedValue = "";
        let masked = "";

        maskCustom = {
            mask: "00000000000",
        };
        masked = IMask.createMask(maskCustom);
        maskedValue = masked.resolve(value);
        setIdentificationNumber(maskedValue);
    };

    console.log(identificationNumber);
    useEffect(() => {
        // con el preferenceId en mano, inyectamos el script de mercadoPago
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://sdk.mercadopago.com/js/v2";
        script.addEventListener("load", addCheckout()); // Cuando cargue el script, se ejecutará la función addCheckout
        document.body.appendChild(script);
    }, [atualiza]);

    return ( 
        <div>
  <div className="mt-4 container">
    <div className="row">
      <div className="col-sm-9">
        <form
          id="form-checkout-assinatura"
          onSubmit={(event) => submitOpcoes(event)}
          //   onClick={() => setAtualiza(!atualiza)}
        >
          <div className="card">
            <div className="card-header">
              <button
                className="btn btn-sm btn-danger float-end"
                type="button"
                onClick={() => setAtualiza(!atualiza)}
              >
                <i className="mdi mdi-lock-reset"> </i> Actualizar{" "}
              </button>{" "}
            </div>{" "}
            <div className="card-body">
              {" "}
              <div className="row">
                <div className="col-sm-12">
                  <div className="form-group">
                    <label htmlFor="form-checkout__cardholderName">
                      Titular de la tarjeta{" "}
                    </label>{" "}
                    <input
                      onClick={() => setAtualiza(!atualiza)}
                      autoComplete="on"
                      className="form-control"
                      name="cardholderName"
                      id="form-checkout__cardholderName"
                      type="text"
                      placeholder="Titular de la tarjeta"
                    />
                  </div>{" "}
                </div>{" "}
              </div>{" "}
              <div className="row">
                <div className="col-sm-12">
                  <div className="form-group col-sm-12">
                    <label htmlFor="form-checkout__identificationNumber">
                      Tipo documento{" "}
                    </label>{" "}
                    <div className="input-group">
                      <div className="input-group-text">
                        <select
                          name="identificationType"
                          id="form-checkout__identificationType"
                          className="identificationType form-control"
                        >
                          <option value="" disabled selected>
                            {" "}
                            Tipo de documento{" "}
                          </option>{" "}
                        </select>{" "}
                      </div>{" "}
                      <input
                        autoComplete="on"
                        className="form-control"
                        name="identificationNumber"
                        id="form-checkout__identificationNumber"
                        type="text"
                        placeholder="CPF del titular de la tarjeta"
                        value={identificationNumber}
                        onChange={handleCpf}
                      />{" "}
                    </div>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
              <div className="row">
                <div className="col-sm-12">
                  <div className="form-group">
                    <label htmlFor="form-checkout__cardNumber">
                      Numero tarjeta{" "}
                    </label>{" "}
                    <div className="input-group">
                      <input
                        autoComplete="on"
                        id="form-checkout__cardNumber"
                        className="form-control"
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        value={ccnumber}
                        onChange={handleCardNumber}
                      />{" "}
                      <div className="input-group-text">
                        {" "}
                        {/* <FontAwesomeIcon  />{" "} */}{" "}
                      </div>{" "}
                    </div>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
              <div className="row">
                <div className="form-group col-4">
                  <label htmlFor="form-checkout__cardExpirationMonth">
                    mes{" "}
                  </label>{" "}
                  <input
                    placeholder="MM"
                    autoComplete="off"
                    type="text"
                    name="cardExpirationYear"
                    id="form-checkout__cardExpirationMonth"
                    className="cardExpirationYear form-control"
                    maxLength="2"
                  />
                </div>{" "}
                <div className="form-group col-4">
                  <label htmlFor="form-checkout__cardExpirationYear">
                    ano{" "}
                  </label>{" "}
                  <input
                    placeholder="YYYY"
                    autoComplete="off"
                    type="text"
                    name="cardExpirationYear"
                    id="form-checkout__cardExpirationYear"
                    className="cardExpirationYear form-control"
                    maxLength="4"
                  />
                </div>{" "}
                <div className="col-4">
                  <div className="form-group">
                    <label htmlFor="form-checkout__securityCode">
                      CVV / CVC{" "}
                    </label>{" "}
                    <input
                      className="form-control"
                      id="form-checkout__securityCode"
                      type="text"
                      placeholder="123"
                    />
                  </div>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
            <input
              autoComplete="off"
              type="hidden"
              name="cardholderEmail"
              id="form-checkout__cardholderEmail"
              value="aynoei@hotmail.com"
            />
            <select
              name="installments"
              id="form-checkout__installments"
              className="installments form-control"
            ></select>{" "}
            <select
              name="checkout__issuer"
              id="form-checkout__issuer"
              className="installments form-control"
            ></select>{" "}
            <div className="card-footer">
              <button
                className="btn btn-sm btn-success float-end"
                type="submit"
              >
                <i className="mdi mdi-gamepad-circle"> </i> Pagar{" "}
              </button>{" "}
              <button className="btn btn-sm btn-danger" type="reset">
                <i className="mdi mdi-lock-reset"> </i> Reset{" "}
              </button>{" "}
            </div>{" "}
          </div>{" "}
        </form>{" "}
      </div>{" "}
    </div>{" "}
  </div>{" "}
</div>

    );
};

export default Form;