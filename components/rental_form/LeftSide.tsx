"use client";
import logoColor from "/public/static/images/logo/logo-black.png";
import logoWhite from "/public/static/images/logo/logo-white.png";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Spinner from "../ui/Spinner";

import { CheckIcon } from "@heroicons/react/24/solid";
import BasicDetailsForm from "../progress_tab/BasicDetailsForm";
import UploadDocumentsForm from "../progress_tab/UploadDocumentsForm";

function LeftSide({ userForm, setUserForm, selectedFiles, setSelectedFiles }: any) {
  const [currentTab, setCurrentTab] = useState(1);

  const [steps, setSteps] = useState([
    {
      id: 1,
      name: "Basic details",
      onClick: (userForm: any) => {
        handleStepChange(1, userForm);
      },
      status: "current",
    },
    {
      id: 2,
      name: "Document uploads",
      onClick: (userForm) => {
        handleStepChange(2, userForm);
      },
      status: "upcoming",
    },
    {
      id: 3,
      name: "Preview & Payment",
      onClick: (userForm) => {
        handleStepChange(3, userForm);
      },
      status: "upcoming",
    },
  ]);

  const handleStepChange = (step_id: number, userForm: any) => {
    if (step_id === 2) {
      if (userForm.name &&
        userForm.phone &&
        userForm.address.address1 && userForm.address.address2 &&
        userForm.address.city &&
        userForm.address.landmark &&
        userForm.address.pincode && userForm.vehicle_name && userForm.vehicle_number) {

        setCurrentTab(step_id);

        setSteps((prev) =>
          prev.map((step) => {
            if (step.id === 2) {
              return { ...step, status: "current" };
            } else if (step.id === 1) {
              return {
                ...step,
                status: "complete",
              };
            } else {
              return step;
            }
          })
        );
      }
    } else if (step_id === 3) {
      if (
        userForm.name &&
        userForm.phone &&
        userForm.address.address1 && userForm.address.address2 &&
        userForm.address.city &&
        userForm.address.landmark &&
        userForm.address.pincode && userForm.vehicle_name && userForm.vehicle_number &&
        userForm.profile_pic_url &&
        userForm.uploaded_documents?.aadhar?.front &&
        userForm.uploaded_documents?.aadhar?.back &&
        userForm.uploaded_documents?.pan &&
        userForm.uploaded_documents?.dl?.front &&
        userForm.uploaded_documents?.dl?.back
      ) {
        setCurrentTab(step_id);
      }
    }else{
      setCurrentTab(step_id)
      setSteps((prev) =>
        prev.map((step) => {
          if (step.id === step_id) {
            return { ...step, status: "current" };
          } else {
            return {
              ...step,
              status: step.status === "complete" ? "complete" : "upcoming",
            };
          }
        })
      );
    }
  };

  return (
    <div className="lg:w-1/2 px-5 pt-5">
      <header className="mb-4">
        <Link href="/" className="">
          <Image
            priority={true}
            height={logoColor.height * 0.2}
            width={logoColor.width * 0.25}
            src={logoColor.src}
            className="block dark:hidden"
            alt="Logo"
          />
          <Image
            priority={true}
            height={logoWhite.height}
            width={logoWhite.width}
            src={logoWhite.src}
            className="hidden dark:block"
            alt="Logo"
          />
        </Link>
      </header>

      {/* Progress Bar */}
      <nav aria-label="Progress">
        <ol
          role="list"
          className="divide-y divide-gray-300 rounded-md border border-gray-300 md:flex md:divide-y-0"
        >
          {steps.map((step, stepIdx) => (
            <li key={step.name} className="relative md:flex md:flex-1">
              {step.status === "complete" ? (
                <button
                  onClick={async () => {
                    step.onClick(userForm);
                  }}
                  className="group flex w-full items-center"
                >
                  <span className="flex items-center px-6 py-4 text-sm font-medium">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-success-300 group-hover:bg-success-300">
                      <CheckIcon
                        aria-hidden="true"
                        className="h-6 w-6 text-white"
                      />
                    </span>
                    <span className="ml-4 text-sm font-medium text-gray-900">
                      {step.name}
                    </span>
                  </span>
                </button>
              ) : step.status === "current" ? (
                <button
                  onClick={async () => {
                    step.onClick(userForm);
                  }}
                  aria-current="step"
                  className="flex items-center px-6 py-4 text-sm font-medium"
                >
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-indigo-600">
                    <span className="text-indigo-600">0{step.id}</span>
                  </span>
                  <span className="ml-4 text-sm font-medium text-indigo-600">
                    {step.name}
                  </span>
                </button>
              ) : (
                <button
                  onClick={async () => {
                    step.onClick(userForm);
                  }}
                  className="group flex items-center"
                >
                  <span className="flex items-center px-6 py-4 text-sm font-medium">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300 group-hover:border-gray-400">
                      <span className="text-gray-500 group-hover:text-gray-900">
                        0{step.id}
                      </span>
                    </span>
                    <span className="ml-4 text-sm font-medium text-gray-500 group-hover:text-gray-900">
                      {step.name}
                    </span>
                  </span>
                </button>
              )}

              {stepIdx !== steps.length - 1 ? (
                <>
                  {/* Arrow separator for lg screens and up */}
                  <div
                    aria-hidden="true"
                    className="absolute right-0 top-0 hidden h-full w-5 md:block"
                  >
                    <svg
                      fill="none"
                      viewBox="0 0 22 80"
                      preserveAspectRatio="none"
                      className="h-full w-full text-gray-300"
                    >
                      <path
                        d="M0 -2L20 40L0 82"
                        stroke="currentcolor"
                        vectorEffect="non-scaling-stroke"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </>
              ) : null}
            </li>
          ))}
        </ol>
      </nav>

      <div
        className="px-6 py-4 overflow-y-auto"
        style={{ height: "calc(100% - 150px)" }}
      >
        {currentTab === 1 ? (
          <BasicDetailsForm
            userForm={userForm}
            setUserForm={setUserForm}
            handleStepChange={handleStepChange}
          />
        ) : currentTab === 2 ? (
          <UploadDocumentsForm
            userForm={userForm}
            setUserForm={setUserForm}
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            handleStepChange={handleStepChange}
          />
        ) : (
          <BasicDetailsForm />
        )}

        {/* <nav className="flex items-center justify-center flex-wrap gap-x-11 pt-24">
          <Link href="#" className="text-sm text-bgray-700 dark:text-white">
            Terms & Condition
          </Link>
          <Link href="#" className="text-sm text-bgray-700 dark:text-white">
            Privacy Policy
          </Link>
          <Link href="#" className="text-sm text-bgray-700 dark:text-white">
            Help
          </Link>
          <Link href="#" className="text-sm text-bgray-700 dark:text-white">
            English
          </Link>
        </nav> */}
        <p className="text-bgray-600 dark:text-white text-center text-sm mt-6">
          @ 2024 Electica Energy. All Right Reserved.
        </p>
      </div>
    </div>
  );
}

export default LeftSide;
