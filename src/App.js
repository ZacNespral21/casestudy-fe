import React from "react";
import Card from "react-credit-cards-2";

import {
  formatCVV,
  formatExpirationDateMth,
  formatExpirationDateYr
} from "./utils";

export default class App extends React.Component {
  state = {
    cardnum: "",
    name: "",
    expmth: "",
    expyr: "",
    cvv: "",
    issuer: "",
    focused: "",
    formData: null,
    actionURL: 'http://localhost:8080/validate',
    isValid: false,
    response: ''
  };

  handleCallback = ({ issuer }, isValid) => {
    if (isValid) {
      this.setState({ issuer });
    }
  };

  handleInputFocus = ({ target }) => {
    this.setState({
      focused: target.name
    });
  };

  handleInputChange = ({ target }) => {
    if (target.name === "cardnum") {
      target.value = target.value
    } else if (target.name === "expmth") {
      target.value = formatExpirationDateMth(target.value);
    } else if (target.name === "expyr") {
      target.value = formatExpirationDateYr(target.value);
    } else if (target.name === "cvv") {
      target.value = formatCVV(target.value);
    }

    this.setState({ [target.name]: target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { issuer } = this.state;
    const formData = [...e.target.elements]
      .filter(d => d.name)
      .reduce((acc, d) => {
        acc[d.name] = d.value;
        return acc;
      }, {});

    fetch(this.state.actionURL, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      console.log(response.status);
      if (response.status >= 200 && response.status < 300) {
        this.state.isValid = true;
        this.state.response = 'Success! Your Card Is Valid!'
        this.setState({ formData });
        this.form.reset();
        console.log(response);
      } else {
        this.state.isValid = false;
        this.state.response = 'Ooops...Looks like your card is invalid, try again!'
        console.log('Somthing happened wrong');
        console.log(response);
      }
    }).catch(err => err);
  };

  render() {
    const { name, cardnum, expmth, expyr, cvv, focused, issuer, actionURL } = this.state;

    return (
      <div key="Payment">
        <div className="App-payment">
          <Card
            number={cardnum}
            name={name}
            expiry={expmth + '/' + expyr}
            cvv={cvv}
            focused={focused}
            callback={this.handleCallback}
          />
          <form ref={c => (this.form = c)} onSubmit={this.handleSubmit} action={actionURL} method="post">
            <div className="form-group">
              <input
                type="tel"
                name="cardnum"
                className="form-control"
                placeholder="Card Number"
                pattern="\d{16,22}"
                required
                onChange={this.handleInputChange}
                onFocus={this.handleInputFocus}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Name"
                required
                onChange={this.handleInputChange}
                onFocus={this.handleInputFocus}
              />
            </div>
            <div className="row">
              <div className="col-3">
                <input
                  type="tel"
                  name="expmth"
                  className="form-control"
                  placeholder="MM"
                  pattern="\d\d"
                  required
                  onChange={this.handleInputChange}
                  onFocus={this.handleInputFocus}
                />
              </div>
              <div className="col-3">
                <input
                  type="tel"
                  name="expyr"
                  className="form-control"
                  placeholder="YY"
                  pattern="\d\d"
                  required
                  onChange={this.handleInputChange}
                  onFocus={this.handleInputFocus}
                />
              </div>
              <div className="col-6">
                <input
                  type="tel"
                  name="cvv"
                  className="form-control"
                  placeholder="cvv"
                  pattern="\d{3,4}"
                  required
                  onChange={this.handleInputChange}
                  onFocus={this.handleInputFocus}
                />
              </div>
            </div>
            <input type="hidden" name="issuer" value={issuer} />
            <div className="form-actions">
              <button className="btn btn-primary btn-block">PAY</button>
            </div>
          </form>
          <div className="col-12 mt-4">
            <h3 className={(this.state.isValid ? 'text-center text-success' : 'text-center text-danger')}>
              {this.state.response}
            </h3>
          </div>
        </div>
      </div>
    );
  }
}
