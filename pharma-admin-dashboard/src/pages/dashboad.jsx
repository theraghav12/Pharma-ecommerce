import React from 'react';
import { BsCurrencyDollar, BsBoxSeam } from 'react-icons/bs';
import { FiBarChart } from 'react-icons/fi';
import { MdOutlineSupervisorAccount } from 'react-icons/md';
import { HiOutlineRefresh } from 'react-icons/hi';
import { GoDotFill } from 'react-icons/go';
import { earningData } from '../data/dummy2.js';
import welcomeBg from '../assets/welcome-bg.svg';
import BarGraph from '../components/Charts/BarGraph.jsx';

const iconComponents = {
  FiBarChart: <FiBarChart />,
  BsBoxSeam: <BsBoxSeam />,
  MdOutlineSupervisorAccount: <MdOutlineSupervisorAccount />,
  HiOutlineRefresh: <HiOutlineRefresh />,
};

const Dashboard = () => {
  return (
    <div className="p-4 mt-2 space-y-8">
      
      {/* Welcome & Earnings Card */}
      <div className="flex flex-wrap lg:flex-nowrap justify-center">
        <div
          className="bg-white h-44 rounded-xl w-full lg:w-[70vw] p-8 pt-9 m-3 bg-no-repeat bg-center bg-cover"
          style={{ backgroundImage: `url(${welcomeBg})`, backgroundSize: 'cover' }}
        >
          <div className="flex justify-between items-center gap-6">
            <div>
              <p className="font-bold text-gray-600">Earnings</p>
              <p className="text-2xl font-semibold">$63,448.78</p>
            </div>
            <button
              type="button"
              className="text-2xl text-white bg-black rounded-full p-4 hover:drop-shadow-xl"
            >
              <BsCurrencyDollar />
            </button>
          </div>
          <div className="mt-6">
            <button className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-800 transition">
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Earnings Summary Cards */}
      <div className="flex flex-wrap justify-center gap-4">
        {earningData.map((item) => (
          <div
            key={item.title}
            className="bg-white shadow-md h-44 w-64 p-4 pt-6 rounded-xl flex flex-col justify-between"
          >
            <div>
              <button
                type="button"
                style={{ color: item.iconColor, backgroundColor: item.iconBg }}
                className="text-xl p-3 rounded-full"
              >
                {iconComponents[item.icon]}
              </button>
              <div className="mt-4">
                <p className="text-lg font-semibold">{item.amount}</p>
                <p className={`text-sm text-${item.pcColor} mt-1`}>{item.percentage}</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm">{item.title}</p>
          </div>
        ))}
      </div>

      {/* Revenue Section */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Revenue Updates</h2>
          <div className="flex gap-6">
            <div className="flex items-center gap-2 text-gray-500">
              <GoDotFill className="text-gray-400" />
              <span>Expense</span>
            </div>
            <div className="flex items-center gap-2 text-green-500">
              <GoDotFill />
              <span>Budget</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-8">
            <div>
              <p className="text-3xl font-semibold">$93,438 <span className="ml-3 text-xs text-white bg-green-400 px-2 py-1 rounded-full">+23%</span></p>
              <p className="text-gray-500 mt-1">Budget</p>
            </div>
            <div>
              <p className="text-3xl font-semibold">$48,438</p>
              <p className="text-gray-500 mt-1">Expense</p>
            </div>
          </div>
          <div className="w-full md:w-[60%]">
            <BarGraph
              data1={[300, 144, 443, 655, 237, 755]}
              data2={[200, 44, 343, 555, 137, 655]}
              title1="Revenue"
              title2="Transaction"
              bgColor1="rgb(0,115,255)"
              bgColor2="rgb(53,162,235,0.8)"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
