import { ReactNode, createContext, useContext } from "react";

export type SensorData = {
	id: number;
	title: string;
	unit: string;
	values?: SensorValue[];
	allowableValues?: string[];
	minMax?: {
		min: number;
		max: number;
	};
};

export type SensorValue = {
	date: Date;
	value: string | number;
};

const sensors: SensorData[] = [
	{
		id: 96,
		unit: "℃",
		title: "MDL Temperature",
		minMax: {
			min: 18.4,
			max: 24,
		},
	},
	{
		id: 97,
		unit: "%",
		title: "MDL Humidity",
		minMax: {
			min: 52,
			max: 59,
		},
	},
	{
		id: 98,
		unit: "hPa",
		title: "MDL Pressure",
		minMax: {
			min: 996.8,
			max: 1000.2,
		},
	},
	{
		id: 99,
		unit: "ppm",
		title: "MDL CO2",
		minMax: {
			min: 478,
			max: 845,
		},
	},
	{
		id: 100,
		unit: "ppb",
		title: "MDL TVOC",
		minMax: {
			min: 16,
			max: 929,
		},
	},
	{
		id: 101,
		unit: "",
		title: "MDL Infrared",
		minMax: {
			min: 0,
			max: 46,
		},
	},
	{
		id: 102,
		unit: "lux",
		title: "MDL Illumination",
		minMax: {
			min: 1,
			max: 168,
		},
	},
	{
		id: 103,
		unit: "",
		title: "MDL Activity",
		minMax: {
			min: 0,
			max: 57,
		},
	},
	{
		id: 104,
		unit: "V",
		title: "MDL Socket Plug Voltage",
		minMax: {
			min: 241.6,
			max: 252.9,
		},
	},
	{
		id: 105,
		unit: "mA",
		title: "MDL Socket Plug Current",
		minMax: {
			min: 2,
			max: 2,
		},
	},
	{
		id: 106,
		unit: "Watt",
		title: "MDL Socket Plug Power",
		minMax: {
			min: 0,
			max: 0,
		},
	},
	{
		id: 107,
		unit: "%",
		title: "MDL Socket Power Factor",
		minMax: {
			min: 100,
			max: 100,
		},
	},
	{
		id: 108,
		unit: "Wh",
		title: "MDL Socket Power Consumption",
		minMax: {
			min: 202,
			max: 202,
		},
	},
	{
		id: 109,
		unit: "℃",
		title: "Cafeteria Temperature",
		minMax: {
			min: 19.7,
			max: 21.3,
		},
	},
	{
		id: 110,
		unit: "%",
		title: "Cafeteria Humidity",
		minMax: {
			min: 59.5,
			max: 63.5,
		},
	},
	{
		id: 111,
		unit: "hPa",
		title: "Cafeteria Pressure",
		minMax: {
			min: 997.5,
			max: 1000.9,
		},
	},
	{
		id: 112,
		unit: "ppm",
		title: "Cafeteria CO2",
		minMax: {
			min: 465,
			max: 916,
		},
	},
	{
		id: 113,
		unit: "ppb",
		title: "Cafeteria TVOC",
		minMax: {
			min: 120,
			max: 249,
		},
	},
	{
		id: 114,
		unit: "",
		title: "Cafeteria Infrared",
		minMax: {
			min: 1,
			max: 39,
		},
	},
	{
		id: 115,
		unit: "lux",
		title: "Cafeteria Illumination",
		minMax: {
			min: 1,
			max: 61,
		},
	},
	{
		id: 116,
		unit: "ppl",
		title: "Cafeteria Activity",
		minMax: {
			min: 0,
			max: 443,
		},
	},
	{
		id: 117,
		unit: "V",
		title: "CL4 Projector Socket Plug Voltage",
		minMax: {
			min: 243.7,
			max: 248.2,
		},
	},
	{
		id: 118,
		unit: "mA",
		title: "CL4 Projector Socket Plug Current",
		minMax: {
			min: 2,
			max: 1043,
		},
	},
	{
		id: 119,
		unit: "Watt",
		title: "CL4 Projector Socket Plug Power",
		minMax: {
			min: 0,
			max: 218,
		},
	},
	{
		id: 120,
		unit: "%",
		title: "CL4 Projector Socket Power Factor",
		minMax: {
			min: 41,
			max: 100,
		},
	},
	{
		id: 121,
		unit: "",
		title: "CL4 Projector Socket Status",
		allowableValues: ["open", "closed"],
	},
	{
		id: 122,
		unit: "Wh",
		title: "CL4 Projector Socket Power Consumption",
		minMax: {
			min: 9105,
			max: 10261,
		},
	},
];

export const getSensorData = (): SensorData[] => {
	return sensors.map((sensor) => {
		const values = Array.from({ length: 24 * 90 }, (_, index) => {
			const date = new Date();
			date.setHours(date.getHours() - index * 1); // Adjust the time decrement as needed

			let value;
			if (sensor.allowableValues && sensor.allowableValues.length > 0) {
				// Pick a random value from allowableValues
				const randomIndex = Math.floor(Math.random() * sensor.allowableValues.length);
				value = sensor.allowableValues[randomIndex];
			} else if (sensor.minMax) {
				// Generate a random number between min and max and round it to two decimal places
				const range = sensor.minMax.max - sensor.minMax.min;
				value = Number((Math.random() * range + sensor.minMax.min).toFixed(2));
			} else {
				value = 0; // Default value if neither exist
			}

			return { date, value };
		});

		return {
			id: sensor.id,
			title: sensor.title,
			unit: sensor.unit,
			values: values,
		};
	});
};

export const SensorContext = createContext<SensorData[]>(getSensorData());
export const useSensorData = () => useContext(SensorContext);

interface SensorProviderProps {
	children: ReactNode;
}

export const SensorProvider: React.FC<SensorProviderProps> = ({ children }) => {
	const sensorData = useContext(SensorContext);
	return <SensorContext.Provider value={sensorData}>{children}</SensorContext.Provider>;
};
