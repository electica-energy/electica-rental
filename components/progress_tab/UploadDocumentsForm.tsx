import Image from "next/image";
import profileImg from "/public/static/images/avatar/profile.png";
import coverImg from "/public/static/images/others/cover.jpg";
import { useState } from "react";
import Spinner from "../ui/Spinner";

function UploadDocumentsForm({
  userForm,
  setUserForm,
  selectedFiles,
  setSelectedFiles,
  handleStepChange,
}: any) {
  const [isLoading, setIsLoading] = useState(false);

  const handleFilesUpload = async () => {
    if (
      !selectedFiles?.profile_pic ||
      !selectedFiles?.aadhar?.front ||
      !selectedFiles?.aadhar?.back ||
      !selectedFiles?.pan
      // !selectedFiles?.dl?.front ||
      // !selectedFiles?.dl?.back
    )
      return;

    setIsLoading(true);

    const fileInfos: any = [];
    fileInfos.push({
      file: selectedFiles?.profile_pic,
      filename: selectedFiles?.profile_pic?.name,
      documentType: "profile_pic",
      contentType: selectedFiles?.profile_pic?.type,
    });
    fileInfos.push({
      file: selectedFiles?.aadhar?.front,
      filename: selectedFiles?.aadhar?.front?.name,
      documentType: "aadhar_front",
      contentType: selectedFiles?.aadhar?.front?.type,
    });
    fileInfos.push({
      file: selectedFiles?.aadhar?.back,
      filename: selectedFiles?.aadhar?.back?.name,
      documentType: "aadhar_back",
      contentType: selectedFiles?.aadhar?.back?.type,
    });
    fileInfos.push({
      file: selectedFiles?.pan,
      filename: selectedFiles?.pan?.name,
      documentType: "pan",
      contentType: selectedFiles?.pan?.type,
    });

    if (selectedFiles?.dl?.front) {
      fileInfos.push({
        file: selectedFiles?.dl?.front,
        filename: selectedFiles?.dl?.front?.name,
        documentType: "dl_front",
        contentType: selectedFiles?.dl?.front?.type,
      });
    }

    if (selectedFiles?.dl?.back) {
      fileInfos.push({
        file: selectedFiles?.dl?.back,
        filename: selectedFiles?.dl?.back?.name,
        documentType: "dl_back",
        contentType: selectedFiles?.dl?.back?.type,
      });
    }

    try {
      const response = await fetch("/api/generate_presignedurl", {
        method: "POST",
        body: JSON.stringify({
          fileInfos: fileInfos?.map((fileInfo: any) => ({
            filename: fileInfo.filename,
            documentType: fileInfo.documentType,
            contentType: fileInfo.contentType,
          })),
        }),
      });

      if (response.ok) {
        const data = await response.json();

        data?.preSignedUrls?.map(async (dataInfo: any) => {
          await uploadFile(
            fileInfos?.find(
              (fileInfo: any) => fileInfo.documentType === dataInfo.documentType
            ).file,
            dataInfo.preSignedUrl
          );
        });

        setIsLoading(false);

        setUserForm((prev: any) => {
          const updatedData = {
            ...prev,
            profile_pic_url: data?.preSignedUrls?.find(
              (fileInfo: any) => fileInfo.documentType === "profile_pic"
            )?.filename,
            uploaded_documents: {
              aadhar: {
                front: data?.preSignedUrls?.find(
                  (fileInfo: any) => fileInfo.documentType === "aadhar_front"
                )?.filename,
                back: data?.preSignedUrls?.find(
                  (fileInfo: any) => fileInfo.documentType === "aadhar_back"
                )?.filename,
              },
              pan: data?.preSignedUrls?.find(
                (fileInfo: any) => fileInfo.documentType === "pan"
              )?.filename,
              dl: {
                front: "",
                back: ""
              },
            },
          };

          if(data?.preSignedUrls?.find(
            (fileInfo: any) => fileInfo.documentType === "dl_front"
          )){
            updatedData.dl.front = data?.preSignedUrls?.find((fileInfo: any) => fileInfo.documentType === "dl_front")?.filename
          };

          if(data?.preSignedUrls?.find((fileInfo: any) => fileInfo.documentType === "dl_back")){
            updatedData.dl.back = data?.preSignedUrls?.find((fileInfo: any) => fileInfo.documentType === "dl_back")?.filename
          }
          return updatedData;
        });

        handleStepChange(3);
      } else {
        console.error("Error uploading file");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  // Function to upload file using pre-signed URL
  async function uploadFile(file: any, preSignedUrl: string) {
    try {
      const fileData = await file.arrayBuffer();
      const response = await fetch(preSignedUrl, {
        method: "PUT",
        body: fileData,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      return response;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }

  return (
    <div className="2xl:col-span-4 xl:col-span-5 2xl:mt-24">
      <header className="mb-8">
        <h3 className="text-2xl font-bold pb-5 text-bgray-900 dark:text-white dark:border-darkblack-400 border-b border-bgray-200">
          Personal Documents
        </h3>
        <p className="mt-8 text-bgray-500">
          Profile Image of at least Size
          <span className="text-bgray-900 dark:text-darkblack-300 ml-2">
            300x300.
          </span>{" "}
          File size should be.
          <span className="text-bgray-900 ml-2">Max 5mb.</span>
        </p>
        <div className="text-center m-auto w-40 h-40 relative mt-2">
          <Image
            priority={true}
            height={profileImg.height}
            width={profileImg.width}
            src={
              selectedFiles?.profile_pic
                ? URL?.createObjectURL(selectedFiles?.profile_pic)
                : profileImg.src
            }
            alt=""
            className="rounded-full"
          />
          <input
            id="profile_pic_chooser"
            name="profile_pic"
            type="file"
            accept="image/*"
            onChange={(event) => {
              setSelectedFiles((prev: any) => {
                return { ...prev, profile_pic: event?.target?.files?.[0] };
              });
            }}
            className="hidden"
          />
          <button
            onClick={() => {
              document?.getElementById("profile_pic_chooser")?.click();
            }}
            aria-label="none"
            className="absolute right-4 bottom-1"
          >
            <svg
              width="29"
              height="29"
              viewBox="0 0 29 29"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="14.2414" cy="14.2414" r="14.2414" fill="#22C55E" />
              <path
                d="M14.6994 10.2363C15.7798 11.3167 16.8434 12.3803 17.9171 13.454C17.7837 13.584 17.6403 13.7174 17.5036 13.8574C15.5497 15.8114 13.5924 17.7653 11.6385 19.7192C11.5118 19.8459 11.3884 19.9726 11.2617 20.0927C11.2317 20.1193 11.185 20.1427 11.145 20.1427C10.1281 20.146 9.11108 20.1427 8.0941 20.146C8.02408 20.146 8.01074 20.1193 8.01074 20.0593C8.01074 19.049 8.01074 18.0354 8.01408 17.0251C8.01408 16.9784 8.03742 16.9217 8.06743 16.8917C9.26779 15.688 10.4682 14.4876 11.6685 13.2873C12.6655 12.2903 13.6591 11.2967 14.6561 10.2997C14.6761 10.2797 14.6861 10.253 14.6994 10.2363Z"
                fill="white"
              />
              <path
                d="M18.6467 12.7197C17.573 11.646 16.506 10.579 15.4424 9.51537C15.6324 9.31864 15.8292 9.11858 16.0259 8.91852C16.256 8.68845 16.4894 8.45838 16.7228 8.22831C17.0162 7.93822 17.4197 7.93822 17.7097 8.22831C18.4466 8.9552 19.1802 9.68542 19.9171 10.4123C20.2038 10.6957 20.2138 11.0992 19.9371 11.3859C19.5136 11.8261 19.0868 12.2629 18.6634 12.703C18.66 12.7097 18.65 12.7163 18.6467 12.7197Z"
                fill="white"
              />
            </svg>
          </button>
        </div>
      </header>
      <div>
        <h4 className="font-bold text-lg text-bgray-800 dark:text-white">
          {"Aadhar (Front & Back)"}
        </h4>
        <p className="mb-4 text-bgray-500 dark:text-bgray-50">
          Cover of at least Size
          <span className="text-bgray-900">1170x920 </span>
        </p>
        <div className="flex justify-center gap-x-4">
          <div className="relative w-full">
            <Image
              priority={true}
              height={coverImg.height}
              width={coverImg.width}
              src={
                selectedFiles?.aadhar?.front
                  ? URL?.createObjectURL(selectedFiles?.aadhar.front)
                  : coverImg.src
              }
              className="w-full rounded-md"
              alt=""
            />
            <input
              id="aadhar_front_pic_chooser"
              name="aadhar_front_pic"
              type="file"
              accept="image/*"
              onChange={(event) => {
                setSelectedFiles((prev: any) => {
                  return {
                    ...prev,
                    aadhar: {
                      ...prev.aadhar,
                      front: event?.target?.files?.[0],
                    },
                  };
                });
              }}
              className="hidden"
            />
            <button
              onClick={() => {
                document?.getElementById("aadhar_front_pic_chooser")?.click();
              }}
              aria-label="none"
              className="absolute right-2 bottom-2"
            >
              <svg
                width="29"
                height="29"
                viewBox="0 0 29 29"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="14.2414" cy="14.2414" r="14.2414" fill="#22C55E" />
                <path
                  d="M14.6994 10.2363C15.7798 11.3167 16.8434 12.3803 17.9171 13.454C17.7837 13.584 17.6403 13.7174 17.5036 13.8574C15.5497 15.8114 13.5924 17.7653 11.6385 19.7192C11.5118 19.8459 11.3884 19.9726 11.2617 20.0927C11.2317 20.1193 11.185 20.1427 11.145 20.1427C10.1281 20.146 9.11108 20.1427 8.0941 20.146C8.02408 20.146 8.01074 20.1193 8.01074 20.0593C8.01074 19.049 8.01074 18.0354 8.01408 17.0251C8.01408 16.9784 8.03742 16.9217 8.06743 16.8917C9.26779 15.688 10.4682 14.4876 11.6685 13.2873C12.6655 12.2903 13.6591 11.2967 14.6561 10.2997C14.6761 10.2797 14.6861 10.253 14.6994 10.2363Z"
                  fill="white"
                />
                <path
                  d="M18.6467 12.7197C17.573 11.646 16.506 10.579 15.4424 9.51537C15.6324 9.31864 15.8292 9.11858 16.0259 8.91852C16.256 8.68845 16.4894 8.45838 16.7228 8.22831C17.0162 7.93822 17.4197 7.93822 17.7097 8.22831C18.4466 8.9552 19.1802 9.68542 19.9171 10.4123C20.2038 10.6957 20.2138 11.0992 19.9371 11.3859C19.5136 11.8261 19.0868 12.2629 18.6634 12.703C18.66 12.7097 18.65 12.7163 18.6467 12.7197Z"
                  fill="white"
                />
              </svg>
            </button>
          </div>
          <div className="relative w-full">
            <Image
              priority={true}
              height={coverImg.height}
              width={coverImg.width}
              src={
                selectedFiles?.aadhar?.back
                  ? URL?.createObjectURL(selectedFiles?.aadhar.back)
                  : coverImg.src
              }
              className="w-full rounded-md"
              alt=""
            />
            <input
              id="aadhar_back_pic_chooser"
              name="aadhar_back_pic"
              type="file"
              accept="image/*"
              onChange={(event) => {
                setSelectedFiles((prev: any) => {
                  return {
                    ...prev,
                    aadhar: { ...prev.aadhar, back: event?.target?.files?.[0] },
                  };
                });
              }}
              className="hidden"
            />
            <button
              onClick={() => {
                document?.getElementById("aadhar_back_pic_chooser")?.click();
              }}
              aria-label="none"
              className="absolute right-2 bottom-2"
            >
              <svg
                width="29"
                height="29"
                viewBox="0 0 29 29"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="14.2414" cy="14.2414" r="14.2414" fill="#22C55E" />
                <path
                  d="M14.6994 10.2363C15.7798 11.3167 16.8434 12.3803 17.9171 13.454C17.7837 13.584 17.6403 13.7174 17.5036 13.8574C15.5497 15.8114 13.5924 17.7653 11.6385 19.7192C11.5118 19.8459 11.3884 19.9726 11.2617 20.0927C11.2317 20.1193 11.185 20.1427 11.145 20.1427C10.1281 20.146 9.11108 20.1427 8.0941 20.146C8.02408 20.146 8.01074 20.1193 8.01074 20.0593C8.01074 19.049 8.01074 18.0354 8.01408 17.0251C8.01408 16.9784 8.03742 16.9217 8.06743 16.8917C9.26779 15.688 10.4682 14.4876 11.6685 13.2873C12.6655 12.2903 13.6591 11.2967 14.6561 10.2997C14.6761 10.2797 14.6861 10.253 14.6994 10.2363Z"
                  fill="white"
                />
                <path
                  d="M18.6467 12.7197C17.573 11.646 16.506 10.579 15.4424 9.51537C15.6324 9.31864 15.8292 9.11858 16.0259 8.91852C16.256 8.68845 16.4894 8.45838 16.7228 8.22831C17.0162 7.93822 17.4197 7.93822 17.7097 8.22831C18.4466 8.9552 19.1802 9.68542 19.9171 10.4123C20.2038 10.6957 20.2138 11.0992 19.9371 11.3859C19.5136 11.8261 19.0868 12.2629 18.6634 12.703C18.66 12.7097 18.65 12.7163 18.6467 12.7197Z"
                  fill="white"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="font-bold text-lg text-bgray-800 dark:text-white">
          {"PAN"}
        </h4>
        <p className="mb-4 text-bgray-500 dark:text-bgray-50">
          Cover of at least Size
          <span className="text-bgray-900">1170x920 </span>
        </p>
        <div className="flex justify-center gap-x-4">
          <div className="relative w-full">
            <Image
              priority={true}
              height={coverImg.height}
              width={coverImg.width}
              src={
                selectedFiles?.pan
                  ? URL?.createObjectURL(selectedFiles?.pan)
                  : coverImg.src
              }
              className="w-full rounded-md"
              alt=""
            />
            <input
              id="pan_pic_chooser"
              name="pan_pic"
              type="file"
              accept="image/*"
              onChange={(event) => {
                setSelectedFiles((prev: any) => {
                  return { ...prev, pan: event?.target?.files?.[0] };
                });
              }}
              className="hidden"
            />
            <button
              onClick={() => {
                document?.getElementById("pan_pic_chooser")?.click();
              }}
              aria-label="none"
              className="absolute right-2 bottom-2"
            >
              <svg
                width="29"
                height="29"
                viewBox="0 0 29 29"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="14.2414" cy="14.2414" r="14.2414" fill="#22C55E" />
                <path
                  d="M14.6994 10.2363C15.7798 11.3167 16.8434 12.3803 17.9171 13.454C17.7837 13.584 17.6403 13.7174 17.5036 13.8574C15.5497 15.8114 13.5924 17.7653 11.6385 19.7192C11.5118 19.8459 11.3884 19.9726 11.2617 20.0927C11.2317 20.1193 11.185 20.1427 11.145 20.1427C10.1281 20.146 9.11108 20.1427 8.0941 20.146C8.02408 20.146 8.01074 20.1193 8.01074 20.0593C8.01074 19.049 8.01074 18.0354 8.01408 17.0251C8.01408 16.9784 8.03742 16.9217 8.06743 16.8917C9.26779 15.688 10.4682 14.4876 11.6685 13.2873C12.6655 12.2903 13.6591 11.2967 14.6561 10.2997C14.6761 10.2797 14.6861 10.253 14.6994 10.2363Z"
                  fill="white"
                />
                <path
                  d="M18.6467 12.7197C17.573 11.646 16.506 10.579 15.4424 9.51537C15.6324 9.31864 15.8292 9.11858 16.0259 8.91852C16.256 8.68845 16.4894 8.45838 16.7228 8.22831C17.0162 7.93822 17.4197 7.93822 17.7097 8.22831C18.4466 8.9552 19.1802 9.68542 19.9171 10.4123C20.2038 10.6957 20.2138 11.0992 19.9371 11.3859C19.5136 11.8261 19.0868 12.2629 18.6634 12.703C18.66 12.7097 18.65 12.7163 18.6467 12.7197Z"
                  fill="white"
                />
              </svg>
            </button>
          </div>
          <div className="relative w-full"></div>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="font-bold text-lg text-bgray-800 dark:text-white">
          {"Driving License (Front & Back) - Optional"}
        </h4>
        <p className="mb-4 text-bgray-500 dark:text-bgray-50">
          Cover of at least Size
          <span className="text-bgray-900">1170x920 </span>
        </p>
        <div className="flex justify-center gap-x-4">
          <div className="relative w-full">
            <Image
              priority={true}
              height={coverImg.height}
              width={coverImg.width}
              src={
                selectedFiles?.dl?.front
                  ? URL?.createObjectURL(selectedFiles?.dl.front)
                  : coverImg.src
              }
              className="w-full rounded-md"
              alt=""
            />
            <input
              id="dl_front_pic_chooser"
              name="dl_front_pic"
              type="file"
              accept="image/*"
              onChange={(event) => {
                setSelectedFiles((prev: any) => {
                  return {
                    ...prev,
                    dl: { ...prev.dl, front: event?.target?.files?.[0] },
                  };
                });
              }}
              className="hidden"
            />
            <button
              onClick={() => {
                document?.getElementById("dl_front_pic_chooser")?.click();
              }}
              aria-label="none"
              className="absolute right-2 bottom-2"
            >
              <svg
                width="29"
                height="29"
                viewBox="0 0 29 29"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="14.2414" cy="14.2414" r="14.2414" fill="#22C55E" />
                <path
                  d="M14.6994 10.2363C15.7798 11.3167 16.8434 12.3803 17.9171 13.454C17.7837 13.584 17.6403 13.7174 17.5036 13.8574C15.5497 15.8114 13.5924 17.7653 11.6385 19.7192C11.5118 19.8459 11.3884 19.9726 11.2617 20.0927C11.2317 20.1193 11.185 20.1427 11.145 20.1427C10.1281 20.146 9.11108 20.1427 8.0941 20.146C8.02408 20.146 8.01074 20.1193 8.01074 20.0593C8.01074 19.049 8.01074 18.0354 8.01408 17.0251C8.01408 16.9784 8.03742 16.9217 8.06743 16.8917C9.26779 15.688 10.4682 14.4876 11.6685 13.2873C12.6655 12.2903 13.6591 11.2967 14.6561 10.2997C14.6761 10.2797 14.6861 10.253 14.6994 10.2363Z"
                  fill="white"
                />
                <path
                  d="M18.6467 12.7197C17.573 11.646 16.506 10.579 15.4424 9.51537C15.6324 9.31864 15.8292 9.11858 16.0259 8.91852C16.256 8.68845 16.4894 8.45838 16.7228 8.22831C17.0162 7.93822 17.4197 7.93822 17.7097 8.22831C18.4466 8.9552 19.1802 9.68542 19.9171 10.4123C20.2038 10.6957 20.2138 11.0992 19.9371 11.3859C19.5136 11.8261 19.0868 12.2629 18.6634 12.703C18.66 12.7097 18.65 12.7163 18.6467 12.7197Z"
                  fill="white"
                />
              </svg>
            </button>
          </div>
          <div className="relative w-full">
            <Image
              priority={true}
              height={coverImg.height}
              width={coverImg.width}
              src={
                selectedFiles?.dl?.back
                  ? URL?.createObjectURL(selectedFiles?.dl.back)
                  : coverImg.src
              }
              className="w-full rounded-md"
              alt=""
            />
            <input
              id="dl_back_pic_chooser"
              name="dl_back_pic"
              type="file"
              accept="image/*"
              onChange={(event) => {
                setSelectedFiles((prev: any) => {
                  return {
                    ...prev,
                    dl: { ...prev.dl, back: event?.target?.files?.[0] },
                  };
                });
              }}
              className="hidden"
            />
            <button
              onClick={() => {
                document?.getElementById("dl_back_pic_chooser")?.click();
              }}
              aria-label="none"
              className="absolute right-2 bottom-2"
            >
              <svg
                width="29"
                height="29"
                viewBox="0 0 29 29"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="14.2414" cy="14.2414" r="14.2414" fill="#22C55E" />
                <path
                  d="M14.6994 10.2363C15.7798 11.3167 16.8434 12.3803 17.9171 13.454C17.7837 13.584 17.6403 13.7174 17.5036 13.8574C15.5497 15.8114 13.5924 17.7653 11.6385 19.7192C11.5118 19.8459 11.3884 19.9726 11.2617 20.0927C11.2317 20.1193 11.185 20.1427 11.145 20.1427C10.1281 20.146 9.11108 20.1427 8.0941 20.146C8.02408 20.146 8.01074 20.1193 8.01074 20.0593C8.01074 19.049 8.01074 18.0354 8.01408 17.0251C8.01408 16.9784 8.03742 16.9217 8.06743 16.8917C9.26779 15.688 10.4682 14.4876 11.6685 13.2873C12.6655 12.2903 13.6591 11.2967 14.6561 10.2997C14.6761 10.2797 14.6861 10.253 14.6994 10.2363Z"
                  fill="white"
                />
                <path
                  d="M18.6467 12.7197C17.573 11.646 16.506 10.579 15.4424 9.51537C15.6324 9.31864 15.8292 9.11858 16.0259 8.91852C16.256 8.68845 16.4894 8.45838 16.7228 8.22831C17.0162 7.93822 17.4197 7.93822 17.7097 8.22831C18.4466 8.9552 19.1802 9.68542 19.9171 10.4123C20.2038 10.6957 20.2138 11.0992 19.9371 11.3859C19.5136 11.8261 19.0868 12.2629 18.6634 12.703C18.66 12.7097 18.65 12.7163 18.6467 12.7197Z"
                  fill="white"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            aria-label="none"
            className="rounded-lg bg-success-300 text-white font-semibold mt-10 py-3.5 px-4 disabled:opacity-80"
            onClick={handleFilesUpload}
            disabled={
              !selectedFiles?.profile_pic ||
              !selectedFiles?.aadhar?.front ||
              !selectedFiles?.aadhar?.back ||
              !selectedFiles?.pan ||
              // !selectedFiles?.dl?.front ||
              // !selectedFiles?.dl?.back ||
              (userForm.profile_pic_url &&
                userForm.uploaded_documents?.aadhar?.front &&
                userForm.uploaded_documents?.aadhar?.back &&
                userForm.uploaded_documents?.pan)
              // userForm.uploaded_documents?.dl?.front &&
              // userForm.uploaded_documents?.dl?.back
            }
          >
            {isLoading ? (
              <Spinner radius={5} />
            ) : userForm.profile_pic_url &&
              userForm.uploaded_documents?.aadhar?.front &&
              userForm.uploaded_documents?.aadhar?.back &&
              userForm.uploaded_documents?.pan ? (
              // userForm.uploaded_documents?.dl?.front &&
              // userForm.uploaded_documents?.dl?.back
              "File Uploaded!"
            ) : (
              "Upload & Continue"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadDocumentsForm;
