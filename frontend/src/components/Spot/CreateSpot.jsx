import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { csrfFetch } from "../../store/csrf";

import { useAppDispatch } from "../../store";
import { CreateSpotField } from "./CreateSpotField";
import { Error } from "../Error";

/** @type {({endpoint, body}: {endpoint: string, body: any}) => Promise<Response> } */
const postAPI = async ({ endpoint, body }) => {
  return csrfFetch(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  });
};

/**
 * @typedef {Object} CreateSpotDetails
 * @prop {Record<string, string | number | undefined>} spotDetails
 * @prop {Array<string>} imgUrls
 * @param {CreateSpotDetails} details
 * @returns {Promise<{type: "spot", spot: App.Spot} | {type: "error", error: App.CreateSpotError}>}
 */
const createSpot = async ({ spotDetails, imgUrls }) => {
  try {
    const createSpotResponse = await postAPI({
      endpoint: "/api/spots",
      body: spotDetails,
    });
    const spot = await createSpotResponse.json();

    const spotImagePromises = imgUrls.map((url, i) =>
      postAPI({
        endpoint: `/api/spots/${spot.id}/images`,
        body: { url, preview: i === 0 },
      })
    );
    const addImageRes = await Promise.all(spotImagePromises);
    return { type: "spot", spot };
  } catch (err) {
    const error = await err.json();
    return { type: "error", error };
  }
};

export const CreateSpot = () => {
  /** @type {Omit<App.Spot, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>} */
  /** @type {Record<string, string | number | undefined>} */
  const initialSpotForm = {
    country: "",
    address: "",
    city: "",
    state: "",
    lat: undefined,
    lng: undefined,
    description: "",
    name: "",
    price: undefined,
  };
  const initialImgForm = {
    imgPreview: "",
    img1: "",
    img2: "",
    img3: "",
    img4: "",
  };
  const navigate = useNavigate();
  const [spotForm, setSpotForm] = useState(initialSpotForm);
  const [imgForm, setImgForm] = useState(initialImgForm);
  /** @type {[Record<string, FormValidatorResult>, any]} */
  const [errors, setErrors] = useState({});

  /** @type {[App.CreateSpotError['errors'], any]} */
  const [backendErrors, setBackendErrors] = useState({});

  /** @type {(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void} */
  const handleChangeSpot = (e) => {
    setSpotForm({
      ...spotForm,
      [e.target.name]: e.target.value,
    });
  };

  const isDisabledSubmit = Object.values(spotForm).some(
    (field) => field.length === 0
  );

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
    /** @type {Record<string, boolean | string | FormValidatorResult>} */
    const emptyErrors = {};

    // Each field in spotForm must have a value
    for (const field of fieldsToDisplay) {
      const value = spotForm[field];
      const validatorFn = formValidators[field] || formValidators["default"];
      const result = validatorFn.call(formValidators, value);
      emptyErrors[field] = result;
      //   if (!result.pass) {
      //   }
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

    const hasFormErrors = Object.values(emptyErrors).some(
      (error) => !error.pass
    );

    if (hasFormErrors) {
      console.log({ emptyErrors });
      setErrors({ ...emptyErrors });
    } else {
      console.log("Creating a spot...");
      const { imgPreview, ...remaining } = imgForm;
      const imgUrls = [imgPreview, ...Object.values(remaining)].filter(
        (url) => url.length > 0
      );
      //   const response = await dispatch(createSpot(spotForm, imgUrls));

      const response = await createSpot({ spotDetails: spotForm, imgUrls });
      if (response.type === "error") {
        console.log("got errors", response.error.errors);
        setBackendErrors(response.error.errors);
      } else if (response.type === "spot") {
        navigate(`/spots/${response.spot.id}`);
      }
    }
    console.log("--", { hasFormErrors, errors, backendErrors });
  };

  /**
   * @typedef {Object} FormValidatorResult
   * @prop {boolean} pass
   * @prop {string} message
   * @callback Validator
   * @param {string | number | undefined} value
   * @param {string} [message]
   * @returns {FormValidatorResult}
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

  /** @type {Record<string, App.CreateSpotFormLabel>} */
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
      error: errors.description?.message,
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
      error: errors.name?.message,
    },
    price: {
      heading: "Set a base price for your spot",
      caption:
        "Competitive pricing can help your listing stand out and rank higher in search results.",
      fieldName: "price",
      placeholder: "Price per night (USD)",
      value: spotForm.price,
      onChangeHandler: handleChangeSpot,
      error: errors.price?.message,
    },
  };

  return (
    <div>
      <div>
        <h1>Create a New Spot</h1>
        <button onClick={handleFillDummyData}>Fill in dummy data</button>
        <h2>Where's your place located?</h2>
        Guests will only get your exact address once they booked a reservation.
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          {fieldsToDisplay.map((field) => (
            <CreateSpotField key={field} propData={fieldData[field]} />
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
          <button disabled={isDisabledSubmit}>Create Spot</button>
        </form>
      </div>
    </div>
  );
};
