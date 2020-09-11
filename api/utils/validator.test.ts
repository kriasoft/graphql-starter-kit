import { validate } from "./validator";

[
  {},
  {
    email: "test@example.com",
    displayName: "test",
    website: "https://example.com",
  },
  {
    email: "err",
    displayName: "err",
    website: "err",
  },
].forEach((input) => {
  test(`validate(${JSON.stringify(input)})`, () => {
    const { data, errors } = validate(input, (x) =>
      x
        .field("email")
        .isRequired()
        .isEmail()

        .field("displayName", { as: "display_name" })
        .isRequired()
        .isLength({ min: 4 })

        .field("website")
        .isURL(),
    );

    expect({ data, errors }).toMatchSnapshot();
  });
});
