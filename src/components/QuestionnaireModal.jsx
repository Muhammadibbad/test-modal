import React, { useEffect, useState } from "react";

import { ReactComponent as CloseIcon } from "../assets/CloseIcon.svg";
import { ReactComponent as ChevronDown } from "../assets/ChevronDownLightGray.svg";
import { ReactComponent as OtherIcon } from "../assets/questionnaire/other.svg";
import { ReactComponent as CheckmarkIcon } from "../assets/CheckmarkIconGray.svg";
import axios from "axios";
import { createUser } from "../lib/userSlice";
import { Dialog, Transition } from "@headlessui/react";
import { RadioGroup } from "@headlessui/react";

import { useDispatch, useSelector } from "react-redux";
import { setDontShow } from "../lib/dontShow";

import { QuestionnairePages } from "./questionnaire"; // Question Data


const QuestionnaireModal =React.forwardRef((props, forwardedRef) => {



  const dontShowRedux = useSelector((state) => state.dontShow.show);

  const initialObjectState = {
    occupation: "",
    discovery: "",
    usageExplanation: "",
    user: "hic@gmail.com",
  };

  const initialOther = {
    occupation: "",
    discovery: "",
    usageExplanation: "",
    
  };
  const dispatch = useDispatch();
  const [open, setOpen] = useState(dontShowRedux); // Change this to redux managed state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedValue, setSelectedValue] = useState(initialObjectState);
  const [err, setErr] = useState(false);
  const [other, setOther] = useState(initialOther);
  const [users, setUser] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
 
 console.log("test",selectedValue)
  console.log("other test",other)




  
  
  const checkSubmitText = () => {
    
    const SubmitUser = users.filter((item, index) => {
      if (item.user === initialObjectState.user) {
        setOpen(false);
        return true;
      }
    });
    
    
  }



  const handleChange = (e) => {
    console.log(e.target.value);
    if (QuestionnairePages[currentQuestion].key === "occupation") {
      setOther({ ...other, occupation: e.target.value });
    }
    if (QuestionnairePages[currentQuestion].key === "discovery") {
      setOther({ ...other, discovery: e.target.value });
    }
    if (QuestionnairePages[currentQuestion].key === "usageExplanation") {
      setOther({ ...other, usageExplanation: e.target.value });
    }
     

    
    
  };

  async function fetchData() {
    try {
      const response = await axios.get(
        "https://qstnr.intvw.logodiffusion.com/api/questionnaire/"
      );
      // Handle the data from the API response
      console.log(response.data);
      setUser(response.data);
    } catch (error) {
      // Handle any errors that occurred during the API request
      console.error("Error fetching data:", error);
    }
  }

  
  
  useEffect(() => {
    fetchData();
    
  }, []);

  useEffect(() => {
    
    checkSubmitText()
  }, [users]);


  const handleClick = (title, key) => {
    if (key === "occupation") {
      setSelectedValue({ ...selectedValue, occupation: title });
      setOther({...other,[key]:""})
    }
    if (key === "discovery") {
      setSelectedValue({ ...selectedValue, discovery: title });
      setOther({...other,[key]:""})
    }
    if (key === "usageExplanation") {
      setSelectedValue({ ...selectedValue, usageExplanation: title });
      setOther({...other,[key]:""})
    }
     
    // Return the created object
  };


  function combineAndRemoveEmpty(obj1, obj2) {
    const combinedObject = {};
  
    for (const prop in obj1) {
      if (obj1[prop] !== null && obj1[prop] !== undefined && obj1[prop] !== "") {
        combinedObject[prop] = obj1[prop];
      }
    }
  
    for (const prop in obj2) {
      if (obj2[prop] !== null && obj2[prop] !== undefined && obj2[prop] !== "") {
        combinedObject[prop] = obj2[prop];
      }
    }
  
    return combinedObject;
  }

  const handleNext = (key) => {
    if (selectedValue[key] === "" && other[key]=== "") {
     setErr(true);
    }
    else if (currentQuestion < 2 && (selectedValue[key] !== "" || other[key] !== "")) {
      setCurrentQuestion((prevQuestion) => prevQuestion + 1);
      
      setErr(false);
    } else {
      
      console.log("final", selectedValue);
      const combinedResult = combineAndRemoveEmpty(selectedValue, other);
      console.log("boom====",combinedResult);
      setSelectedValue("")
      setOther(initialOther)
      
        dispatch(createUser(combinedResult))
       setOpen(false)
    }
  };

  const emptyState=()=>{
    console.log("empty")
    setSelectedValue({...selectedValue,[QuestionnairePages[currentQuestion].key]:""})
  }

  const handlePrev = (key) => {
    setErr(false);

      // setSelectedValue({ ...selectedValue, [key]: "" });
    setCurrentQuestion((prevQuestion) => prevQuestion - 1);
    console.log("dep", QuestionnairePages[currentQuestion].key);
  };

  const dontShow = () => {
     dispatch(setDontShow(  false ));
    setIsChecked(!isChecked);
console.log("hi")
    
  };

  return (
    <Transition appear show={open} as={React.Fragment}>
      <Dialog
       ref={forwardedRef}
        open={open}
        onClose={() => setOpen(false)}
        className="relative z-50"
      >
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto custom-scroll">
          <div className="flex min-h-full items-center justify-center p-4 text-center ">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className="w-[700px] max-w-11/12 pt-8 flex flex-col gap-6 justify-around items-center overflow-hidden relative bg-app-black rounded-md"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="w-8 aspect-square rounded-full absolute top-2 right-3 bg-black bg-opacity-60 hover:bg-opacity-90 transition-all duration-200 flex items-center justify-center"
                  onClick={() => setOpen(false)}
                >
                  <CloseIcon className="w-6 h-6" />
                </button>

                <div className="flex flex-col items-center gap-1">
                  <h1 className="text-white text-2xl font-bold text-center">
                    {QuestionnairePages[currentQuestion].title}
                  </h1>

                  <p className="text-modal-description text-sm text-center w-9/12 ">
                    Your feedback will help us in developing new features and
                    improving logo diffusion
                  </p>
                </div>

                <RadioGroup className="w-[70%] grid grid-cols-2 grid-rows-2 gap-4 [&>div]:aspect-square">
                  {QuestionnairePages[currentQuestion].options.map(
                    (item, index) => (
                      <RadioGroup.Option
                        className={`p-4 flex flex-col items-center justify-center gap-4 rounded-md bg-app-bg-gray ui-checked:outline-[2px] ui-checked:[outline-style:solid] ui-checked:outline-app-green transition-all duration-300`}
                        value={item["title"]}
                        key={index}
                        onClick={() =>
                          handleClick(
                            item["title"],
                            QuestionnairePages[currentQuestion].key
                          )
                        }
                      >
                        {React.createElement(item["icon"])}
                        <span className="text-white text-base">
                          {item["title"]}
                        </span>
                        <span className="w-11/12 text-sm text-modal-description">
                          {item["subtitle"]}
                        </span>
                      </RadioGroup.Option>
                    )
                  )}

                  {/* <RadioGroup.Option
                    className={`p-4 flex flex-col items-center justify-center gap-4 rounded-md bg-app-bg-gray ui-checked:outline-[2px] ui-checked:[outline-style:solid] ui-checked:outline-app-green transition-all duration-300`}
                    value={"Sampel 1"}
                  >
                    <OtherIcon className="" />
                    <span className="text-white text-base">
                      Sample 1
                    </span>
                    <span className="w-11/12 text-sm text-modal-description">
                      sample
                    </span>
                  </RadioGroup.Option>
                  <RadioGroup.Option
                    className={`p-4 flex flex-col items-center justify-center gap-4 rounded-md bg-app-bg-gray ui-checked:outline-[2px] ui-checked:[outline-style:solid] ui-checked:outline-app-green transition-all duration-300`}
                    value={"Sampel 2"}
                  >
                    <OtherIcon className="" />
                    <span className="text-white text-base">
                      Sample 2
                    </span>
                    <span className="w-11/12 text-sm text-modal-description">
                      sample
                    </span>
                  </RadioGroup.Option> */}
                  <RadioGroup.Option
                    className={`p-4 flex flex-col items-center justify-center gap-4 rounded-md bg-app-bg-gray ui-checked:outline-[2px] ui-checked:[outline-style:solid] ui-checked:outline-app-green transition-all duration-300`}
                    value={"-1"}
                    key="-1"
                    onClick={emptyState}
                  >
                    <OtherIcon className="" />

                    <span className="text-white text-base">Other</span>
                    <textarea
                      rows={3}
                      className=" w-11/12 text-sm text-modal-description p-2 rounded-lg !outline-none bg-app-bg-gray placeholder:text-modal-description border-solid border border-text-field-border "
                      placeholder="Please specify."
                      onInput={handleChange}
                      value={other[QuestionnairePages[currentQuestion].key]}
                    />
                  </RadioGroup.Option>
                </RadioGroup>

                {err && <span className="text-red-600">Please Select an Option</span>}
                <div className="flex flex-row gap-2">
                  <button
                    disabled={currentQuestion < 1 ? true : false}
                    onClick={() =>
                      handlePrev(QuestionnairePages[currentQuestion].key)
                    }
                    className="h-12 py-4 pl-3 pr-1 rounded-md group flex gap-1 items-center justify-center transition-all duration-300 [&_path]:transition-all [&_path]:duration-300 group disabled:cursor-not-allowed"
                  >
                    <ChevronDown
                      className={`rotate-90 [&>path]:stroke-back-btn  w-6 h-6 group-hover:[&>path]:stroke-app-green relative ml-0 mr-1 group-hover:ml-1 group-hover:mr-0 transition-all duration-300`}
                    />
                  </button>
                  <button
                    className="h-12 py-4 pl-3 pr-1 border border-solid border-carousel-button-border bg-app-bg-gray rounded-md group flex gap-1 items-center justify-center transition-all duration-300 [&_path]:transition-all [&_path]:duration-300 group disabled:cursor-not-allowed"
                    //  disabled={values[currentQuestion.key] === undefined}
                    onClick={() =>
                      handleNext(QuestionnairePages[currentQuestion].key)
                    }
                  >
                    <span className="text-carousel-next-count mr-1">
                      {currentQuestion + 1}/{QuestionnairePages.length}
                    </span>

                    <span className="text-white group-disabled:text-carousel-next-count">
                      Next
                    </span>

                    <ChevronDown
                      className={`-rotate-90 [&>path]:stroke-white group-hover:[&>path]:stroke-app-green relative ml-0 mr-1 group-hover:ml-1 group-hover:mr-0 transition-all duration-300`}
                    />
                  </button>
                </div>

                <div className="bg-app-bg-gray w-full p-4 flex items-center justify-center ">
                  <div className="flex flex-row">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      id="dont-show"
                      className="appearance-none h-[17px] w-[17px]  rounded-[4px] border-[1.5px] border-solid border-checkmark-border transition-all duration-200 peer"
                      onChange={dontShow} 
                    />
                    <CheckmarkIcon  className="opacity-0 peer-checked:opacity-100 [&>path]:stroke-checkmark-check absolute rounded-full pointer-events-none my-1 mx-1 transition-all duration-200 w-[9px] h-[9px]" />
                    <label
                      htmlFor="dont-show"
                      className="flex flex-col justify-center px-2 select-none text-xs text-title-white"
                      
                    >
                      Don't show this again
                    </label>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
)
export default QuestionnaireModal;
