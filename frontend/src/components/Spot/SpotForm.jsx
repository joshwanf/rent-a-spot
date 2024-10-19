import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { csrfFetch } from "../../store/csrf";

// import { useAppDispatch } from "../../store";
import { SpotFormField } from "./SpotFormField";
import { Error } from "../Error";

/** @type {({endpoint, body}: {endpoint: {method: 'POST' | 'PUT', route: string}, body: any}) => Promise<Response> } */
const postAPI = async ({ endpoint, body }) => {
  return csrfFetch(endpoint.route, {
    method: endpoint.method,
    body: JSON.stringify(body),
  });
};

/**
 * @typedef {Object} CreateSpotDetails
 * @prop {App.SpotFormData} spotDetails
 * @prop {Array<string>} imgUrls
 * @prop {{method: 'POST' | 'PUT', route: string}} endpoint
 * @param {CreateSpotDetails} details
 * @returns {Promise<{type: "spot", spot: App.Spot} | {type: "error", error: App.CreateSpotError}>}
 */
const createOrEditSpot = async ({ spotDetails, imgUrls, endpoint }) => {
  try {
    const createSpotResponse = await postAPI({
      endpoint,
      body: spotDetails,
    });
    const spot = await createSpotResponse.json();

    if (endpoint.method === "POST") {
      const spotImagePromises = imgUrls.map((url, i) =>
        postAPI({
          endpoint: { method: "POST", route: `/api/spots/${spot.id}/images` },
          body: { url, preview: i === 0 },
        })
      );
      await Promise.all(spotImagePromises);
    }
    return { type: "spot", spot };
  } catch (err) {
    const error = await err.json();
    return { type: "error", error };
  }
};

/** @type {(prop: {initialData?: App.SpotFormData, initialImg?: App.SpotFormImg}) => JSX.Element} */
export const SpotForm = ({ initialData, initialImg }) => {
  console.log("in spot form", { initialData, initialImg });
  /** @type {App.SpotFormData} */
  const emptySpotForm = {
    country: "",
    address: "",
    city: "",
    state: "",
    lat: "",
    lng: "",
    description: "",
    name: "",
    price: "",
  };
  /** @type {App.SpotFormImg} */
  const emptyImgForm = {
    imgPreview: "",
    img1: "",
    img2: "",
    img3: "",
    img4: "",
  };
  console.log("before img form state", initialImg || emptyImgForm);
  const { spotId } = useParams();
  const navigate = useNavigate();
  const [spotForm, setSpotForm] = useState(initialData || emptySpotForm);
  const [imgForm, setImgForm] = useState(initialImg || emptyImgForm);
  console.log("spot form state", { spotForm, imgForm });

  /** @type {[Record<string, App.SpotFormValidatorResult>, React.Dispatch<React.SetStateAction<Record<string, App.SpotFormValidatorResult>>>]} */
  const [errors, setErrors] = useState({});

  // /** @type {[App.CreateSpotError['errors'], React.Dispatch<React.SetStateAction<App.CreateSpotError>>]} */
  // const [backendErrors, setBackendErrors] = useState({});

  /** @type {(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void} */
  const handleChangeSpot = (e) => {
    setSpotForm({
      ...spotForm,
      [e.target.name]: e.target.value,
    });
  };

  const isDisabledSubmit =
    Object.values(spotForm).some((field) => field && field.length === 0) ||
    spotForm.description.length < 30;

  /** @type {(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void} */
  const handleChangeImg = (e) => {
    setImgForm({
      ...imgForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleFillDummyData = () => {
    setSpotForm({
      country: "Magical Country",
      address: new Date().toString(),
      city: new Date().toString(),
      state: new Date().toString(),
      lat: 88,
      lng: 88,
      description: "Come stay in a magical land where your dreams come true!",
      name: "The Magic Kingdom",
      price: 88,
    });
    setImgForm({
      imgPreview: "asdf.png",
      img1: "asdf.jpg",
      img2: "",
      img3: "",
      img4: "",
    });
  };

  /** @type {(e: React.FormEvent<HTMLFormElement>) => Promise<void>} */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validate form submission
    /** @type {Record<string, App.SpotFormValidatorResult>} */
    const emptyErrors = {};

    // Each field in spotForm must pass the validator
    for (const field of fieldsToDisplay) {
      const value = spotForm[field];
      const validatorFn = formValidators[field] || formValidators["default"];
      const result = validatorFn.call(formValidators, value);
      emptyErrors[field] = result;
    }

    // Each image url in imgForm must end in '.jpg' or '.png'
    /** @type {(url: string) => boolean} */
    const isValidImgUrl = (url) => {
      const urlExt = url.slice(-4);
      return [".jpg", ".png"].includes(urlExt);
    };
    for (const [key, value] of Object.entries(imgForm)) {
      if (value !== "" && !isValidImgUrl(value)) {
        emptyErrors[key] = true;
      }
    }

    // Check if at least one field does not pass validator
    const hasFormErrors =
      Object.values(emptyErrors).some((error) => !error.pass) ||
      spotForm.description.length < 30;
    console.log("inside handleSubmit", {
      hasFormErrors,
      emptyErrors,
      spotFormDesLen: spotForm.description.length,
    });

    if (hasFormErrors) {
      setErrors({ ...emptyErrors });
    } else {
      // Package data for createOrEditSpot
      const { imgPreview, ...remaining } = imgForm;
      const imgUrls = [imgPreview, ...Object.values(remaining)].filter(
        (url) => url.length > 0
      );
      //   const response = await dispatch(createSpot(spotForm, imgUrls));

      const route = initialData ? `/api/spots/${spotId}` : "/api/spots";
      const response = await createOrEditSpot({
        spotDetails: spotForm,
        imgUrls,
        endpoint: {
          method: initialData ? "PUT" : "POST",
          route,
        },
      });
      if (response.type === "error") {
        console.log("got errors", response.error.errors);

        // Pass on back end errors
        const backendErrors = {};
        // only pass along backend errors or pass all fields?
        for (const [field, message] of Object.entries(response.error.errors)) {
          backendErrors[field] = { pass: false, message };
        }
        setErrors(backendErrors);
      } else if (response.type === "spot") {
        navigate(`/spots/${response.spot.id}`);
      }
    }
  };

  /**
   * @callback Validator
   * @param {string | number | undefined} value
   * @param {string} [message]
   * @returns {App.SpotFormValidatorResult}
   */
  /** @type {Record<string, Validator>} */
  const formValidators = {
    country: function (value) {
      return this.default(value, "Country is required");
    },
    address: function (value) {
      return this.default(value, "Address is required");
    },
    city: function (value) {
      return this.default(value, "City is required");
    },
    state: function (value) {
      return this.default(value, "State is required");
    },
    latOrLng: function (value) {
      const message = " must be a number";
      return { pass: typeof Number(value) === "number", message };
    },
    lat: function (value) {
      console.log("--", typeof value);
      return this.latOrLng(value);
    },
    lng: function (value) {
      return this.latOrLng(value);
    },
    description: (value) => {
      const message = "Description needs a minimum of 30 characters";
      if (typeof value === "string") {
        return { pass: value.length >= 30, message };
      } else {
        return { pass: false, message };
      }
    },
    name: function (value) {
      return this.default(value, "Name is required");
    },
    price: function (value) {
      return this.default(value, "Price is required");
    },
    default: (value, customMsg) => {
      const message = customMsg ?? "This field did not pass";
      if (typeof value === "string") {
        return { pass: value.length > 0, message };
      } else if (typeof value === "number") {
        return { pass: value >= 0, message };
      } else {
        return { pass: false, message };
      }
    },
  };

  const fieldsToDisplay = [
    "country",
    "address",
    "city",
    "state",
    "lat",
    "lng",
    "description",
    "name",
    "price",
  ];

  /** @type {Record<string, App.SpotFormLabel>} */
  const fieldData = {
    country: {
      heading: "Country",
      caption: "",
      fieldName: "country",
      placeholder: "Country",
      value: spotForm.country,
      onChangeHandler: handleChangeSpot,
      error: !errors.country?.pass ? errors.country?.message : "",
    },
    address: {
      heading: "Street Address",
      caption: "",
      fieldName: "address",
      placeholder: "Address",
      value: spotForm.address,
      onChangeHandler: handleChangeSpot,
      error: !errors.address?.pass ? errors.address?.message : "",
    },
    city: {
      heading: "City",
      caption: "",
      fieldName: "city",
      placeholder: "City",
      value: spotForm.city,
      onChangeHandler: handleChangeSpot,
      error: !errors.city?.pass ? errors.city?.message : "",
    },
    state: {
      heading: "State",
      caption: "",
      fieldName: "state",
      placeholder: "State",
      value: spotForm.state,
      onChangeHandler: handleChangeSpot,
      error: !errors.state?.pass ? errors.state?.message : "",
    },
    lat: {
      heading: "Latitude",
      caption: "",
      fieldName: "lat",
      placeholder: "Latitude",
      value: spotForm.lat,
      onChangeHandler: handleChangeSpot,
      inputType: "number",
      error: !errors.lat?.pass ? errors.lat?.message : "",
    },
    lng: {
      heading: "Longitude",
      caption: "",
      fieldName: "lng",
      placeholder: "Longitude",
      value: spotForm.lng,
      onChangeHandler: handleChangeSpot,
      inputType: "number",
      hrAfter: true,
      error: !errors.lng?.pass ? errors.lng?.message : "",
    },
    description: {
      heading: "Describe your place to guests",
      caption:
        "Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.",
      fieldName: "description",
      placeholder: "Description",
      value: spotForm.description,
      onChangeHandler: handleChangeSpot,
      isTextarea: "textarea",
      hrAfter: true,
      error: !errors.description?.pass ? errors.description?.message : "",
    },
    name: {
      heading: "Create a title for your spot",
      caption:
        "Catch guests' attention with a spot title that highlights what makes your place special.",
      fieldName: "name",
      placeholder: "Name of your spot",
      value: spotForm.name,
      hrAfter: true,
      onChangeHandler: handleChangeSpot,
      error: !errors.name?.pass ? errors.name?.message : "",
    },
    price: {
      heading: "Set a base price for your spot",
      caption:
        "Competitive pricing can help your listing stand out and rank higher in search results.",
      fieldName: "price",
      placeholder: "Price per night (USD)",
      value: spotForm.price,
      onChangeHandler: handleChangeSpot,
      error: !errors.price?.pass ? errors.price?.message : "",
    },
  };

  return (
    <div>
      <div>
        <h1>{!initialData ? "Create a New Spot" : "Update your Spot"}</h1>
        <button onClick={handleFillDummyData}>Fill in dummy data</button>
        <h2>Where&apos;s your place located?</h2>
        Guests will only get your exact address once they booked a reservation.
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          {fieldsToDisplay.map((field) => (
            <SpotFormField key={field} propData={fieldData[field]} />
          ))}
          <hr />
          <fieldset>
            Liven up your spot with photos
            <div>
              Submit a live link to at least one photo to publish your spot.
            </div>
            <label>
              <input
                name="imgPreview"
                placeholder="Preview Image URL"
                onChange={handleChangeImg}
                value={imgForm.imgPreview}
              />
              {errors.imgPreview ? (
                <Error
                  errors={{ imgPreview: "Preview image cannot be empty" }}
                />
              ) : (
                <></>
              )}
            </label>
            <label>
              <input
                name="img1"
                placeholder="Image URL"
                onChange={handleChangeImg}
                value={imgForm.img1}
              />
            </label>
            <label>
              <input
                name="img2"
                placeholder="Image URL"
                onChange={handleChangeImg}
                value={imgForm.img2}
              />
            </label>
            <label>
              <input
                name="img3"
                placeholder="Image URL"
                onChange={handleChangeImg}
                value={imgForm.img3}
              />
            </label>
            <label>
              <input
                name="img4"
                placeholder="Image URL"
                onChange={handleChangeImg}
                value={imgForm.img4}
              />
            </label>
          </fieldset>
          <button disabled={isDisabledSubmit}>
            {!initialData ? "Create a Spot" : "Update your Spot"}
          </button>
        </form>
      </div>
    </div>
  );
};
