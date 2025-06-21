import React from 'react'
import './style.css';
import image from '../../../public/tick.svg'

export default function page() {
    return (
        <div className="flex flex-col justify-center items-center" style={{ width: "100%", height: "100vh", }}>
            <div className="max-w-xl w-full mx-auto bg-gray-900 rounded-xl overflow-hidden">
                <div className="max-w-md mx-auto pt-12 pb-14 px-5 text-center">
                    <div
                        className="inline-flex items-center justify-center w-12 h-12 mb-5 rounded-full"
                    >
                        <svg
                            viewBox="0 0 48 48"
                            height="150"
                            width="150"
                            y="0px"
                            x="0px"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <linearGradient
                                gradientUnits="userSpaceOnUse"
                                y2="37.081"
                                y1="10.918"
                                x2="10.918"
                                x1="37.081"
                                id="SVGID_1__8tZkVc2cOjdg_gr1"
                            >
                                <stop stop-color="#60fea4" offset="0"></stop>
                                <stop stop-color="#6afeaa" offset=".033"></stop>
                                <stop stop-color="#97fec4" offset=".197"></stop>
                                <stop stop-color="#bdffd9" offset=".362"></stop>
                                <stop stop-color="#daffea" offset=".525"></stop>
                                <stop stop-color="#eefff5" offset=".687"></stop>
                                <stop stop-color="#fbfffd" offset=".846"></stop>
                                <stop stop-color="#fff" offset="1"></stop>
                            </linearGradient>
                            <circle
                                fill="url(#SVGID_1__8tZkVc2cOjdg_gr1)"
                                r="18.5"
                                cy="24"
                                cx="24"
                            ></circle>
                            <path
                                d="M35.401,38.773C32.248,41.21,28.293,42.66,24,42.66C13.695,42.66,5.34,34.305,5.34,24	c0-2.648,0.551-5.167,1.546-7.448"
                                stroke-width="3"
                                stroke-miterlimit="10"
                                stroke-linejoin="round"
                                stroke-linecap="round"
                                stroke="#10e36c"
                                fill="none"
                            ></path>
                            <path
                                d="M12.077,9.646C15.31,6.957,19.466,5.34,24,5.34c10.305,0,18.66,8.354,18.66,18.66	c0,2.309-0.419,4.52-1.186,6.561"
                                stroke-width="3"
                                stroke-miterlimit="10"
                                stroke-linejoin="round"
                                stroke-linecap="round"
                                stroke="#10e36c"
                                fill="none"
                            ></path>
                            <polyline
                                points="16.5,23.5 21.5,28.5 32,18"
                                stroke-width="3"
                                stroke-miterlimit="10"
                                stroke-linejoin="round"
                                stroke-linecap="round"
                                stroke="#10e36c"
                                fill="none"
                            ></polyline>
                        </svg>
                    </div>
                    <h4 className="text-xl text-gray-100 font-semibold mb-5">
                     Successfully Completed
                    </h4>
                    <p className="text-gray-300 font-medium">
                    Your leave request is being promptly processed; awaiting approval
                    </p>
                </div>
            </div>

        </div>
    )
}
