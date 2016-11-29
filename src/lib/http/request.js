import render from '../util/render';
import generateToken from '../util/generate-token';

class HttpRequest {
  constructor(request, model, config) {
    this.model = model;
    this.initialize(request);
    this.unescaped = config && config.unescaped;
  }

  initialize(request) {
    this.url = this.renderUrl(request.url);
    this.method = this.renderRequestMethod(request.method);
    this.form = this.renderFormData(request);
    this.data = this.renderData(request);
    this.headers = this.renderRequestHeaders(request);
    this.trace = this.addTraceHeader();
  }

  renderUrl(url) {
    let result;
    if (url) {
      result = render(url, this.model, this.unescaped);
    }
    return result;
  }

  renderRequestMethod(method) {
    let result;
    if (method) {
      result = render(method, this.model, this.unescaped);
    } else {
      result = 'GET';
    }
    return result;
  }

  renderFormData(request) {
    let form;
    if (request.form) {
      form = [];
      request.form.forEach((item) => {
        const renderedKey = render(item.key, this.model, this.unescaped);
        const renderedValue = render(item.value, this.model, this.unescaped);
        const formItem = `${renderedKey}=${renderedValue}`;
        form.push(formItem);
      });
    }
    return form;
  }

  renderData(request) {
    let data;
    if (request.data) {
      data = render(request.data, this.model, this.unescaped);
    }
    return data;
  }

  renderRequestHeaders(request) {
    const headers = [];
    if (request.headers) {
      Object.keys(request.headers).forEach((key) => {
        const value = request.headers[key];
        const concatenated = `${key}: ${render(value, this.model, this.unescaped)}`;
        headers.push(concatenated);
      });
    }
    return headers;
  }

  addTraceHeader() {
    const token = generateToken();
    this.headers.push(`X-Upssert-Trace: ${token}`);
    return token;
  }
}

export default HttpRequest;
