import {PropsWrapperLoadMore} from './interfaces';
import styles from './WrapperLoadMore.module.scss';
import {useRef} from 'react';

function WrapperLoadMore({className, children, fetchNextPage, isFetchingNextPage, hasNextPage, textLoad}: PropsWrapperLoadMore) {
	const ref = useRef<any>(null);

	function handleScroll() {
		const div = ref.current;
		if (div) {
			if (div.scrollTop + div.clientHeight >= div.scrollHeight - 20 && hasNextPage && !isFetchingNextPage) {
				fetchNextPage();
			}
		}
	}

	return (
		<div className={className} ref={ref} onScroll={handleScroll}>
			{children}
			{isFetchingNextPage && textLoad ? <p className={styles.load}>{textLoad}</p> : null}
		</div>
	);
}

export default WrapperLoadMore;
