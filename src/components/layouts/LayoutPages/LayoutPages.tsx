// import TabNavPage from '~/components/common/TabNavPage';
import {Fragment} from 'react';
import {PropsLayoutPages} from './interfaces';

import styles from './LayoutPages.module.scss';

function LayoutPages({children, listPages}: PropsLayoutPages) {
	return (
		<Fragment>
			{/* <TabNavPage listPages={listPages} /> */}

			<div className={styles.main}>{children}</div>
		</Fragment>
	);
}

export default LayoutPages;
