"use client";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import Spinner from "../ui/Spinner";

function PreviewPayment({ userForm, setUserForm }: any) {
  const [isLoading, setIsLoading] = useState(false);

  const idRef = useRef();

  //   useEffect(() => {
  //     createOrderId();
  //   }, []);

  const createOrderId = async (userForm: any) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(userForm?.deposit!) * 100,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const id = data.orderId;
      // idRef.current = id;
      // setLoading1(false);
      await processPayment(id, userForm);
      return;
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    }
  };

  const processPayment = async (orderId: string, userForm: any) => {
    setIsLoading(true);
    //console.log(orderId, process.env.key_id);
    try {
      const options = {
        key: process.env.key_id,
        amount: parseFloat(userForm?.deposit!) * 100,
        currency: "INR",
        name: "Electica Energy", //busniess name
        description: "Payment",
        order_id: orderId,
        handler: async function (response: any) {
          const data = {
            orderCreationId: orderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };

          const result = await fetch("/api/verify", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
          });
          
          const res = await result.json();
          //process further request, whatever should happen after request fails
          if (res.isOk) {
            //alert(res.message);
            await saveProfile(userForm);
          } //process further request after
          else {
            alert(res.message);
          }
        },
        prefill: {
          name: userForm?.name,
          contact: userForm?.phone
        },
        theme: {
          color: "#3399cc",
        },
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", function (response: any) {
        alert(response.error.description);
      });
      setIsLoading(false);
      paymentObject.open();
    } catch (error) {
      console.error(error);
    }
  };

  const saveProfile = async (userForm: any) => {
    try {
      const response = await fetch("/api/users/add", {
        method: "POST",
        body: JSON.stringify(userForm),
      });

      //console.log('@@@@@@response', response)

      if (response.ok) {
        const data = await response.json();
        setIsLoading(false);

        alert("Profile Uploaded!");
        window.location.reload();
      } else {
        console.error("Error saving profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />

      <div className="2xl:col-span-8 xl:col-span-7">
        <h3 className="text-2xl font-bold pb-5 text-bgray-900 dark:text-white dark:border-darkblack-400 border-b border-bgray-200">
          Personal Information&apos;s
        </h3>
        <div className="mt-8">
          <div className="grid 2xl:grid-cols-2 grid-cols-1 gap-6">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="name"
                className="text-base text-bgray-600 dark:text-bgray-50  font-medium"
              >
                Name
              </label>
              <input
                type="text"
                className="text-bgray-800 dark:text-white dark:bg-darkblack-500 dark:border-darkblack-400 text-base border border-bgray-300 h-14 w-full focus:border-success-300 focus:ring-0 rounded-lg px-4 py-3.5 placeholder:text-bgray-500 placeholder:text-base"
                name="name"
                value={userForm?.name}
                placeholder="Arpit Kshirsagar"
                disabled
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-base text-bgray-600 dark:text-bgray-50  font-medium"
              >
                {"Email (Optional)"}
              </label>
              <input
                type="email"
                className="text-bgray-800 dark:text-white dark:bg-darkblack-500 dark:border-darkblack-400 text-base border border-bgray-300 h-14 w-full focus:border-success-300 focus:ring-0 rounded-lg px-4 py-3.5 placeholder:text-bgray-500 placeholder:text-base"
                name="email"
                value={userForm?.email}
                disabled
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="phone"
                className="text-base text-bgray-600 dark:text-bgray-50  font-medium"
              >
                {"Phone Number"}
              </label>
              <input
                type="text"
                className="text-bgray-800 dark:text-white dark:bg-darkblack-500 dark:border-darkblack-400 text-base border border-bgray-300 h-14 w-full focus:border-success-300 focus:ring-0 rounded-lg px-4 py-3.5 placeholder:text-bgray-500 placeholder:text-base"
                name="phone"
                value={userForm?.phone}
                disabled
              />
            </div>
          </div>
          <h4 className="pt-8 pb-6 text-xl font-bold text-bgray-900 dark:text-white">
            Personal Address
          </h4>
          <div className="grid 2xl:grid-cols-2 grid-cols-1 gap-6">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="address1"
                className="text-base text-bgray-600 dark:text-bgray-50  font-medium "
              >
                Address 1
              </label>
              <input
                type="text"
                className="text-bgray-800 dark:text-white dark:bg-darkblack-500 dark:border-darkblack-400 text-base border border-bgray-300 h-14 w-full focus:border-success-300 focus:ring-0 rounded-lg px-4 py-3.5 placeholder:text-bgray-500 placeholder:text-base"
                name="address1"
                value={userForm?.address?.address1}
                disabled
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="address2"
                className="text-base text-bgray-600 dark:text-bgray-50  font-medium "
              >
                Address 2
              </label>
              <input
                type="text"
                className="text-bgray-800 dark:text-white dark:bg-darkblack-500 dark:border-darkblack-400 text-base border border-bgray-300 h-14 w-full focus:border-success-300 focus:ring-0 rounded-lg px-4 py-3.5 placeholder:text-bgray-500 placeholder:text-base"
                name="address2"
                value={userForm?.address?.address2}
                disabled
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="city"
                className="text-base text-bgray-600 dark:text-bgray-50  font-medium"
              >
                City
              </label>
              <input
                type="text"
                placeholder="Indore"
                className="text-bgray-800 dark:text-white dark:bg-darkblack-500 dark:border-darkblack-400 text-base border border-bgray-300 h-14 w-full focus:border-success-300 focus:ring-0 rounded-lg px-4 py-3.5 placeholder:text-bgray-500 placeholder:text-base"
                name="city"
                value={userForm?.address?.city}
                disabled
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="landmark"
                className="text-base text-bgray-600 dark:text-bgray-50  font-medium"
              >
                landmark
              </label>
              <input
                type="text"
                placeholder="Near Electica Power Center"
                className="text-bgray-800 dark:text-white dark:bg-darkblack-500 dark:border-darkblack-400 text-base border border-bgray-300 h-14 w-full focus:border-success-300 focus:ring-0 rounded-lg px-4 py-3.5 placeholder:text-bgray-500 placeholder:text-base"
                name="landmark"
                value={userForm?.address?.landmark}
                disabled
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="pincode"
                className="text-base text-bgray-600 dark:text-bgray-50  font-medium "
              >
                Postal Code
              </label>
              <input
                type="text"
                placeholder="200013"
                className="text-bgray-800 dark:text-white dark:bg-darkblack-500 dark:border-darkblack-400 text-base border border-bgray-300 h-14 w-full focus:border-success-300 focus:ring-0 rounded-lg px-4 py-3.5 placeholder:text-bgray-500 placeholder:text-base"
                name="pincode"
                value={userForm?.address?.pincode}
                disabled
              />
            </div>
          </div>

          <h4 className="pt-8 pb-6 text-xl font-bold text-bgray-900 dark:text-white">
            Vehicle Information
          </h4>
          <div className="grid 2xl:grid-cols-2 grid-cols-1 gap-6">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="vehicle_name"
                className="text-base text-bgray-600 dark:text-bgray-50  font-medium "
              >
                Vehicle Name
              </label>
              <input
                type="text"
                placeholder="Electica Road Runner"
                className="text-bgray-800 dark:text-white dark:bg-darkblack-500 dark:border-darkblack-400 text-base border border-bgray-300 h-14 w-full focus:border-success-300 focus:ring-0 rounded-lg px-4 py-3.5 placeholder:text-bgray-500 placeholder:text-base"
                name="vehicle_name"
                value={userForm?.vehicle_name}
                disabled
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="vehicle_number"
                className="text-base text-bgray-600 dark:text-bgray-50  font-medium"
              >
                Vehicle Number
              </label>
              <input
                type="text"
                placeholder="EE-01987"
                className="text-bgray-800 dark:text-white dark:bg-darkblack-500 dark:border-darkblack-400 text-base border border-bgray-300 h-14 w-full focus:border-success-300 focus:ring-0 rounded-lg px-4 py-3.5 placeholder:text-bgray-500 placeholder:text-base"
                name="vehicle_number"
                value={userForm?.vehicle_number}
                disabled
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="deposit"
                className="text-base text-bgray-600 dark:text-bgray-50  font-medium"
              >
                Deposit
              </label>
              <input
                type="text"
                placeholder="EE-01987"
                className="text-bgray-800 dark:text-white dark:bg-darkblack-500 dark:border-darkblack-400 text-base border border-bgray-300 h-14 w-full focus:border-success-300 focus:ring-0 rounded-lg px-4 py-3.5 placeholder:text-bgray-500 placeholder:text-base"
                name="deposit"
                value={userForm?.deposit}
                onChange={(event) => {
                  setUserForm((prev: any) => {
                    return { ...prev, deposit: Number(event.target.value) };
                  });
                }}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              aria-label="none"
              className="rounded-lg bg-success-300 text-white font-semibold mt-10 py-3.5 px-4 disabled:opacity-80"
              disabled={
                !userForm.name ||
                !userForm.phone ||
                !userForm?.address?.address1 ||
                !userForm.address?.address2 ||
                !userForm.address?.city ||
                !userForm.address?.pincode ||
                !userForm?.vehicle_name ||
                !userForm?.vehicle_number ||
                !userForm.vehicle_name ||
                !userForm.vehicle_number ||
                !userForm.vin_number ||
                !userForm.profile_pic_url ||
                !userForm.uploaded_documents?.aadhar?.front ||
                !userForm.uploaded_documents?.aadhar?.back ||
                !userForm.uploaded_documents?.pan
                // !userForm.uploaded_documents?.dl?.front ||
                // !userForm.uploaded_documents?.dl?.back
              }
              onClick={async (e) => {
                //handleStepChange(2, userForm);
                e.preventDefault();
                await createOrderId(userForm);
              }}
            >
              {isLoading ? <Spinner radius={5} /> : "Pay now!"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default PreviewPayment;
