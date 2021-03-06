describe("envelope", () => {
  test("validate envelope document against common envelope schema", () => {
    // This example file fails validation.
    //let envelope = require("../app/lib/common-cv-model/envelope/example_WithHROpen421.json");

    let envelope = require("./my-example.json");

    let Validator = require("jsonschema").Validator;
    let validator = new Validator();
    let refParser = require("json-schema-ref-parser");
    return refParser
      .dereference("./app/lib/common-cv-model/envelope/DataEnvelope.json", {})
      .then(function(dereferencedSchema) {
        let validatorResult = validator.validate(envelope, dereferencedSchema);
        if (validatorResult.errors.length > 0) {
          console.error(validatorResult.errors[0]);
          console.error(validatorResult.errors[0].instance);
        }
        expect(validatorResult.errors.length).toBe(0);
      });
  });

  test("build envelope from cv document", () => {
    let cv = require("./cv.json");

    let consentTimestamp = new Date();
    let consentedTimePeriod = new Date(consentTimestamp);
    consentedTimePeriod.setMonth(consentedTimePeriod.getMonth() + 1);

    let Envelope = require("../app/lib/envelope");
    let envelope = new Envelope.Builder()
      .withSourceId("01")
      .withSourceName("Arbetsformedlingen")
      .withAllowsWrite(true)
      .withConsentTimestamp(consentTimestamp.toISOString())
      .withConsentStatus(true)
      .withConsentedTimePeriod(consentedTimePeriod.toISOString())
      .withSize("0")
      .withDocumentType("CV")
      .withDataStructureLink(
        "https://github.com/MagnumOpuses/common-cv-model/tree/master/common%20data%20structure"
      )
      .withData(cv)
      .build();

    expect(envelope.source.sourceId).toBe("01");
    expect(envelope.source.sourceName).toBe("Arbetsformedlingen");
    expect(envelope.source.allowsWrite).toBe(true);
    expect(envelope.consent.consentTimestamp).toBe(
      consentTimestamp.toISOString()
    );
    expect(envelope.consent.consentStatus).toBe(true);
    expect(envelope.consent.consentedTimePeriod).toBe(
      consentedTimePeriod.toISOString()
    );
    expect(envelope.data.size).toBe("0");
    expect(envelope.data.documentType).toBe("CV");
    expect(envelope.data.dataStructureLink).toBe(
      "https://github.com/MagnumOpuses/common-cv-model/tree/master/common%20data%20structure"
    );
    expect(envelope.data.data).toBe(cv);

    let Validator = require("jsonschema").Validator;
    let validator = new Validator();
    let refParser = require("json-schema-ref-parser");
    return refParser
      .dereference("./app/lib/common-cv-model/envelope/DataEnvelope.json", {})
      .then(function(dereferencedSchema) {
        let validatorResult = validator.validate(envelope, dereferencedSchema);
        if (validatorResult.errors.length > 0) {
          console.error(validatorResult.errors[0]);
          console.error(validatorResult.errors[0].instance);
        }
        expect(validatorResult.errors.length).toBe(0);
      });
  });
});
