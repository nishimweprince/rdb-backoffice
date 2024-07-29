import StaffDashboardCard from '@/components/cards/DashboardCard';
import DashboardGraph from '@/components/graphs/DashboardGraph';
import Select from '@/components/inputs/Select';
import {
  monthsData,
  staffDashboardCards,
} from '@/constants/dashboard.constants';
import StaffLayout from '@/containers/navigation/StaffLayout';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

const StaffDashboard = () => {
  // STATE VARIABLES
  const [monthsDataArray, setMonthsDataArray] = useState(monthsData());

  // REACT HOOK FORM
  const { control } = useForm();

  return (
    <StaffLayout>
      <main className="flex flex-col items-center justify-center w-full gap-6 px-6">
        {/* DASHBOARD CARDS */}
        <menu className="flex items-start w-full justify-between gap-6 flex-wrap max-[600px]:justify-center max-[600px]:gap-4">
          {staffDashboardCards.map((dashboardCard, index) => {
            return (
              <StaffDashboardCard
                title={dashboardCard?.title}
                change={dashboardCard?.change}
                value={dashboardCard?.value}
                icon={dashboardCard?.icon}
                key={index}
                route={dashboardCard?.route}
              />
            );
          })}
        </menu>
        {/* RECENT ACTIVITIES AND GRAPH */}
        <menu className="flex items-start gap-[1%] w-full h-[40vh] min-h-[50vh] max-[1100px]:flex-col max-[1100px]:h-full max-[1100px]:gap-6">
          <section className="bg-white w-full p-6 h-full min-h-fit flex flex-col gap-4 rounded-md shadow-md max-[1300px]:w-[65%] max-[1100px]:w-full">
            <menu className="flex w-full items-center gap-3 justify-between max-[600px]:flex-col">
              <h1 className="text-lg font-medium">User Overview</h1>
              <span className="flex items-center w-full max-w-[20%] max-[600px]:max-w-[80%]">
                <Controller
                  name="period"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Select
                        placeholder="Select period"
                        options={[
                          { label: 'Yearly', value: 'year' },
                          { label: 'Monthly', value: 'month' },
                        ]}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setMonthsDataArray(monthsData());
                        }}
                      />
                    );
                  }}
                />
              </span>
            </menu>
            <DashboardGraph data={monthsDataArray} dataKey="month" />
          </section>
        </menu>
      </main>
    </StaffLayout>
  );
};

export default StaffDashboard;
