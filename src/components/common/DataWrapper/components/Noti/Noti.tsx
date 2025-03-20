import ImageFill from '~/components/common/ImageFill';
import {PropsNoti} from './interfaces';
import styles from './Noti.module.scss';
import icons from '~/constants/images/icons';

function Noti({img = icons.empty, title = 'Dữ liệu trống', des = 'Hiện tại dữ liệu đang trống!', button}: PropsNoti) {
	return (
		<div className={styles.container}>
			<div className={styles.img}>
				<ImageFill className={styles.icon} src={img} />
			</div>
			{title && <h3>{title}</h3>}
			<p>{des}</p>
			{button ? <div className={styles.btn}>{button}</div> : null}
		</div>
	);
}

export default Noti;
