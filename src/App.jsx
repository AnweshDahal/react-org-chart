import { useEffect, useState } from 'react';
import OrganizationChart from './components/OrganizationChart/organizationChart';
import { treeGeneratorUtil } from './services/dataService/nodeTreeService';

function App() {
	const [data, setData] = useState(null);

	const fetchData = async () => {
		await treeGeneratorUtil().then((value) => {
			setData(value);
		});
	};

	useEffect(() => {
		fetchData();
	}, []);
	return (
		<>
			<OrganizationChart data={data}></OrganizationChart>
		</>
	);
}

export default App;
