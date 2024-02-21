/* eslint-disable react/prop-types */
import React, { useLayoutEffect, useRef } from 'react';
import ReactDOMServer from 'react-dom/server';
import { OrgChart } from 'd3-org-chart';

export default function OrganizationChart(props) {
	const d3Container = useRef(null);

	useLayoutEffect(() => {
		const chart = new OrgChart();
		if (props.data && d3Container.current) {
			chart
				.container(d3Container.current)

				.data(props.data)
				.parentNodeId((d) => d.pid)
				.nodeWidth((d) => 140)
				.nodeHeight((d) => 140)
				.compact(false)
				.compactMarginBetween((d) => 80)
				.nodeContent((d) => {
					return ReactDOMServer.renderToStaticMarkup(
						<div style={{ background: 'red' }}>Hallo</div>
					);
				})
				.render();
		}
	}, [props, props.data]);
	return (
		<>
			<div className="org-chart" ref={d3Container}></div>
		</>
	);
}
