import TestUtils from "react-addons-test-utils";
import Superform from "./Superform";

function setStateMock(state, fn) {
  this.state = {...this.state, ...state};
  setTimeout(() => fn(), 0);
}

describe("Superform", () => {

  let component;

  beforeEach(() => {
    component = new Superform({});
    component.setState = setStateMock;
  });

  it("is not submitted by default", () => {
    expect(component.state.submitted).toBe(false);
  });

  it("has empty data by default", () => {
    expect(component.state.data).toEqual({});
  });

  it("has empty errors by default", () => {
    expect(component.state.data).toEqual({});
  });

  describe("markAsSubmitted", () => {
    it("marks form as submitted", done => {
      component.markAsSubmitted().then(() => {
        expect(component.state.submitted).toBe(true);
        component.markAsSubmitted().then(() => {
          expect(component.state.submitted).toBe(true);
          done();
        });
      });
    });
  });

  describe("isSubmited", () => {
    it("returns submitted state", () => {
      expect(component.isSubmited()).toBe(false);
      component.state.submitted = true;
      expect(component.isSubmited()).toBe(true);
    });
  });

  describe("getValueOf", () => {
    it("returns named field value", () => {
      expect(component.getValueOf("name")).toBe(undefined);
      component.state.data.name = "Uncle Bob";
      expect(component.getValueOf("name")).toBe("Uncle Bob");
    });
  });

  describe("linkStateOf", () => {
    it("returns linked state object with value", () => {
      expect(component.linkStateOf("name").value).toBe(undefined);
      component.state.data.name = "Uncle Bob";
      expect(component.linkStateOf("name").value).toEqual("Uncle Bob");
    });

    it("returns linked state object with requestChange function", () => {
      expect(component.linkStateOf("name").requestChange).toEqual(jasmine.any(Function));
    });
  });

  describe("getData", () => {
    it("returns data state", () => {
      expect(component.getData()).toBe(component.state.data);
    });
  });

  describe("getErrors", () => {
    it("returns errors object without empty arrays", () => {
      component.state.errors = {name: [{rule: "required"}], surname: []};
      expect(component.getErrors()).toEqual({name: [{rule: "required"}]});
    });
  });

  describe("getErrors", () => {
    it("returns errors object without empty arrays", () => {
      component.state.errors = {name: [{rule: "required"}], surname: []};
      expect(component.getErrors()).toEqual({name: [{rule: "required"}]});
    });
  });

  describe("getErrorsOf", () => {
    it("returns errors of particular input", () => {
      component.state.errors = {name: [{rule: "required"}]};
      expect(component.getErrorsOf("name")).toEqual([{rule: "required"}]);
    });

    it("returns empty array for not existing inputs/never validated", () => {
      expect(component.state.errors).toEqual({});
      expect(component.getErrorsOf("name")).toEqual([]);
    });
  });

  describe("isFormValid", () => {
    it("returns true for pristine form as it's valid by default", () => {
      expect(component.isFormValid()).toBe(true);
    });

    it("return false for forms with errors", () => {
      component.state.errors = {name: [{rule: "required"}]};
      expect(component.isFormValid()).toBe(false);
    });
  });

  describe("getErrorMessageOf", () => {
    it("returns null for for unsubmited form", () => {
      component.state.submitted = false;
      component.state.errors = {name: [{rule: "required"}]};
      component.refs = {name: document.createElement("input")};
      expect(component.getErrorMessageOf("name")).toBe(null);
    });

    it("returns null for for valid field form", () => {
      component.state.submitted = true;
      component.refs = {name: document.createElement("input")};
      expect(component.getErrorMessageOf("name")).toBe(null);
    });

    it("returns 'This is not a valid email.' for email field and submitted form", () => {
      component.state.submitted = true;
      component.state.errors = {name: [{rule: "email"}]};
      component.refs = {name: document.createElement("input")};
      expect(component.getErrorMessageOf("name")).toEqual("This is not a valid email.");
    });

    it("returns 'This is not a number.' for number field and submitted form", () => {
      component.state.submitted = true;
      component.state.errors = {name: [{rule: "number"}]};
      component.refs = {name: document.createElement("input")};
      expect(component.getErrorMessageOf("name")).toEqual("This is not a number.");
    });

    it("returns 'This is not a valid URL.' for url field and submitted form", () => {
      component.state.submitted = true;
      component.state.errors = {name: [{rule: "url"}]};
      component.refs = {name: document.createElement("input")};
      expect(component.getErrorMessageOf("name")).toEqual("This is not a valid URL.");
    });

    it("returns 'Field is required.' for required field and submitted form", () => {
      component.state.submitted = true;
      component.state.errors = {name: [{rule: "required"}]};
      component.refs = {name: document.createElement("input")};
      expect(component.getErrorMessageOf("name")).toEqual("Field is required.");
    });

    it("returns 'Value format is invalid.' for pattern field and submitted form", () => {
      component.state.submitted = true;
      component.state.errors = {name: [{rule: "pattern"}]};
      component.refs = {name: document.createElement("input")};
      expect(component.getErrorMessageOf("name")).toEqual("Value format is invalid.");
    });

    it("returns 'Value should be greater or equal :data.' for min field and submitted form", () => {
      component.state.submitted = true;
      component.state.errors = {name: [{rule: "min", data: "10"}]};
      component.refs = {name: document.createElement("input")};
      expect(component.getErrorMessageOf("name")).toEqual("Value should be greater or equal 10.");
    });

    it("returns 'Value should be lower or equal :data.' for max field and submitted form", () => {
      component.state.submitted = true;
      component.state.errors = {name: [{rule: "max", data: "10"}]};
      component.refs = {name: document.createElement("input")};
      expect(component.getErrorMessageOf("name")).toEqual("Value should be lower or equal 10.");
    });

    it("returns 'Value is too short. Value length should be greater or equal :data.' for minLength field and submitted form", () => {
      component.state.submitted = true;
      component.state.errors = {name: [{rule: "minLength", data: "10"}]};
      component.refs = {name: document.createElement("input")};
      expect(component.getErrorMessageOf("name")).toEqual("Value is too short. Value length should be greater or equal 10.");
    });

    it("returns 'Value is too long. Value length should be lower or equal :data.' for maxLength field and submitted form", () => {
      component.state.submitted = true;
      component.state.errors = {name: [{rule: "maxLength", data: "10"}]};
      component.refs = {name: document.createElement("input")};
      expect(component.getErrorMessageOf("name")).toEqual("Value is too long. Value length should be lower or equal 10.");
    });

    it("returns 'Value is too long. Value length should be lower or equal :data.' for equals field and submitted form", () => {
      component.state.submitted = true;
      component.state.errors = {name: [{rule: "equals", data: "name2"}]};
      component.refs = {name: document.createElement("input")};
      expect(component.getErrorMessageOf("name")).toEqual("Value must be the same as name2.");
    });
  });

  describe("_createErrors", () => {
    it("create errors for multiple nodes", () => {
      const nodes = {
        name: (() => {
          const node = document.createElement("input"); node.name = "name";
          node.required = true; return node })(),
        email: (() => {
          const node = document.createElement("input"); node.name = "email";
          node.required = true; node.type = "email"; return node })()
      };
      component.refs = nodes;
      expect(component._createErrors(nodes)).toEqual({
        name: [{rule: "required"}],
        email: [{rule: "required"}, {rule: "email"}],
      });
    });

    it("doesn't create errors for valid nodes", () => {
      const nodes = {
        name: (() => {
          const node = document.createElement("input"); node.name = "name";
          node.required = true; return node })(),
        email: (() => {
          const node = document.createElement("input"); node.name = "email";
          node.required = true; node.type = "email"; node.value = "test@email.com";
          return node })()
      };
      component.refs = nodes;
      expect(component._createErrors(nodes)).toEqual({
        name: [{rule: "required"}]
      });
    });
  });

  describe("_updateErrors", () => {
    it("overwrites errors", done => {
      component.state.errors = {name: [{rule: "required"}]};
      component._updateErrors({name2: [{rule: "required"}]}).then(() => {
        expect(component.state.errors).toEqual({
          name2: [{rule: "required"}]
        });
        done();
      });
    });
  });

  describe("_updateDataOf", () => {
    it("updates data", done => {
      component.state.data = {name: "Uncle Bob"};
      component._updateDataOf("name", "FooBar").then(() => {
        expect(component.state.data).toEqual({
          name: "FooBar"
        });
        component._updateDataOf("name2", "FooBar2").then(() => {
          expect(component.state.data).toEqual({
            name: "FooBar",
            name2: "FooBar2"
          });
          done();
        });
      });
    });
  });

  describe("_updateErrorsOf", () => {
    it("overwrites errors", () => {
      component.state.errors = {name: [{rule: "required"}]};
      component._updateErrorsOf("name", [{rule: "minLength", data: 3}]).then(() => {
        expect(component.state.errors).toEqual([
          {rule: "required"}
        ]);
      });
    });
  });

  describe("_getCustomMessagesOf", () => {
    it("returns custom messages of field", () => {
      component.refs = {
        name: (() => {
          const node = document.createElement("input");
          node.required = true;
          node.type = "email";
          node.dataset.messages = JSON.stringify({ required: "Foo", email: "Bar" });
          return node; })()
      };
      expect(component._getCustomMessagesOf("name")).toEqual({required: "Foo", email: "Bar"});
    });
  });

  describe("_getCustomMessageForRuleOf", () => {
    it("returns custom messages of field for the specified rule", () => {
      component.refs = {
        name: (() => {
          const node = document.createElement("input");
          node.required = true;
          node.type = "email";
          node.dataset.messages = JSON.stringify({ required: "Foo", email: "Bar" });
          return node; })()
      };
      expect(component._getCustomMessageForRuleOf("name", "email")).toEqual("Bar");
    });

    it("returns undefined for the specified rule if custom message doesn't exist", () => {
      component.refs = {
        name: (() => {
          const node = document.createElement("input");
          node.required = true;
          node.dataset.messages = JSON.stringify({ required: "Foo" });
          return node; })()
      };
      expect(component._getCustomMessageForRuleOf("name", "email")).toBeUndefined();
    });
  });

  describe("_getMessage", () => {
    it("returns custom message for rule if specified", () => {
      component.refs = {
        name: (() => {
          const node = document.createElement("input");
          node.required = true;
          node.dataset.messages = JSON.stringify({ required: "Foo" });
          return node; })()
      };
      expect(component._getMessage("name", "required")).toEqual("Foo");
    });

    it("returns default message if rule not specified", () => {
      component.refs = {
        name: (() => {
          const node = document.createElement("input");
          node.required = true;
          node.dataset.messages = JSON.stringify({ required: "Foo" });
          return node; })()
      };
      expect(component._getMessage("name", "email")).toEqual("This is not a valid email.");
    });

    it("returns default message if rule not specified", () => {
      component.refs = {
        name: (() => {
          const node = document.createElement("input");
          node.required = true;
          node.dataset.messages = JSON.stringify({ required: "Foo" });
          return node; })()
      };
      expect(() => {component._getMessage("name", "foo")})
        .toThrowError("Superform: There is no message for such rule. Passed: foo");
    });
  });

  describe("_parseMessage", () => {
    it("parses message", () => {
      const message = "This is :data message";
      const data = "awesome";
      expect(component._parseMessage(message, data)).toEqual("This is awesome message");
    });
  });

  describe("_validateNode", () => {
    it("validates node returning set of errors", () => {
      const node = document.createElement("input");
      node.type = "email";
      node.required = "true";
      node.value = "wrong@email";
      expect(component._validateNode(node)).toEqual([ { rule: "email" } ]);
    });

    it("returns empty array if there is no errors", () => {
      const node = document.createElement("input");
      node.type = "email";
      node.required = "true";
      node.value = "correct@email.com";
      expect(component._validateNode(node)).toEqual([]);
    });
  });
});

