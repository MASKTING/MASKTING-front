import React, { useEffect, useState, useCallback, useRef } from 'react';
import Wrapper from '../../../components/Wrapper';
import { WrapperInner } from '../../../components/Wrapper/Wrapper.style';
import { useNavigate } from 'react-router-dom';
import noneImage from '../../../assets/svg/noneImage.svg';
import BigButton from '../../../components/Button/BigButton/BigButton';
import * as S from './WaitFailEdit.style';
import { useRecoilState } from 'recoil';
import { useForm } from 'react-hook-form';
import { checkNicknameApi } from '../../../api/signup';
import { imageState, imageUrlState } from '../../../recoil';
import Modal from '../../../components/Modal/Modal';
import SideBar from '../../../components/SideBar/SideBar';
import { postResignup } from '../../../api/postResignup';
import api from '../../../api/api';
import { useQuery } from 'react-query';

const dataURLtoFile = (dataurl, fileName) => {
	var arr = dataurl.split(','),
		mime = 'image/jpg',
		bstr = atob(arr[0]),
		n = bstr.length,
		u8arr = new Uint8Array(n);

	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}

	return new File([u8arr], fileName, { type: mime });
};

const WaitFailEdit = () => {
	const [imageFile, setImageFile] = useRecoilState(imageState);
	const [imageUrl, setImageUrl] = useRecoilState(imageUrlState);
	const navigate = useNavigate();
	const [photoErrorMessage, setPhotoErrorMessage] = useState(null);
	const [isModal, setIsModal] = useState(false);
	const [isDuplicate, setIsDuplicate] = useState(false);

	const { register, handleSubmit, formState, watch, setError, clearErrors, errors, setValue } =
		useForm({ mode: 'all' });
	const { data: resignUpInfo } = useQuery('getResignupInfo', () => api('/api/user/re-signup'));
	const imgRef = useRef();

	useEffect(() => {
		if (resignUpInfo?.data) {
			for (const key in resignUpInfo.data) setValue(key, resignUpInfo.data[key]);
			setImageFile({
				originalImage: dataURLtoFile(resignUpInfo.data.profile, resignUpInfo.dataprofilePath),
				maskedImage: dataURLtoFile(
					resignUpInfo.data.maskProfile,
					resignUpInfo.data.maskProfilePath,
				),
			});

			if (!imageUrl) setImageUrl(resignUpInfo.data?.maskedProfilePath);
		}
	}, [resignUpInfo?.data]);

	// MODAL
	const onCloseModal = () => {
		setIsModal(false);
	};

	const modifyRequest = async () => {
		const formData = new FormData();
		formData.append('profiles', dataURLtoFile(watch('profile'), 'test1'));
		formData.append('profiles', dataURLtoFile(watch('maskProfile'), 'test2'));
		formData.append('nickname', watch('nickname'));
		formData.append('bio', watch('bio'));
		formData.append('name', watch('name'));
		formData.append('birth', watch('birth'));
		formData.append('height', watch('height'));

		try {
			const res = await postResignup(formData);
			return res.status;
		} catch (e) {
			alert(e);
		}
	};

	// 2. NICKNAME
	const handleCheckNickname = async () => {
		const data = await checkNicknameApi(watch('nickname'));

		if (!data) {
			//이미 사용중이라면
			setIsDuplicate(true);
			setError('nickname', { message: '사용할 수 없는 닉네임이에요' });
			return;
		} else {
			setIsDuplicate(false);
		}
		setError('nickname', { message: '사용가능한 닉네임이에요' });
	};

	// 3. INTRODUCE
	const introduceCnt = (
		<S.IntroduceCnt cnt={watch('introduce')?.length}>{watch('introduce')?.length}</S.IntroduceCnt>
	);

	const onUploadImage = useCallback(async e => {
		if (!e.target.files) {
			return;
		}
		setImageFile({ originalImage: e.target.files[0] });
		const reader = new FileReader();
		reader.readAsDataURL(imgRef.current.files[0]);
		reader.onload = async () => {
			localStorage.setItem('imageData', reader.result);
			navigate('/wait/fail/edit/mask');
		};
	}, []);

	const onSubmit = async () => {
		if ((await modifyRequest()) === 200) navigate('/wait');
	};

	const submitError = () => {
		if (Object.keys(imageFile).length === 0) setPhotoErrorMessage('이미지를 등록해주세요');
		setIsModal(false);
	};

	const handleEdit = () => {
		setIsModal(true);
	};

	return (
		<Wrapper>
			<WrapperInner>
				<S.TitleWrapper>
					<S.Title>
						{resignUpInfo?.data.nickname}님
						<br /> 다음 항목을 수정해주세요
					</S.Title>
				</S.TitleWrapper>
				<S.Form onSubmit={handleSubmit(onSubmit, submitError)}>
					<S.Content>
						{/* 프로필 사진 */}
						<S.PhotoInfoWrapper>
							{photoErrorMessage ? (
								<S.PhotoErrorMessage>{photoErrorMessage}</S.PhotoErrorMessage>
							) : (
								<S.Red>프로필 사진</S.Red>
							)}
							<S.PhotoBox htmlFor="image">
								<S.PhotoImage htmlFor="image" src={imageUrl} />
								<S.PhotoLogo className="material-icons">edit</S.PhotoLogo>
							</S.PhotoBox>
							<S.InputImage
								{...register('profileImage')}
								type="file"
								accept="image/*"
								id="image"
								ref={imgRef}
								onChange={onUploadImage}
							/>
						</S.PhotoInfoWrapper>
						{/* 닉네임 */}
						<S.HalfInfoWrapper>
							{formState.errors.nickname?.message ? (
								<S.ErrorMessage>{formState.errors?.nickname?.message}</S.ErrorMessage>
							) : (
								<S.Label htmlFor="Introduce">닉네임</S.Label>
							)}
							<S.HalfInput
								{...register('nickname', {
									required: {
										value: true,
										message: '닉네임을 설정해주세요',
									},
									pattern: {
										value: /^[가-힣0-9a-zA-Z\s]{1,10}$/,
										message: '유효하지 않은 닉네임이에요',
									},
									maxLength: {
										value: 10,
										message: '닉네임이 너무 길어요',
									},
								})}
							/>
							<S.BtnCheckNickname type="button" onClick={handleCheckNickname}>
								중복확인
							</S.BtnCheckNickname>
						</S.HalfInfoWrapper>

						{/* 한줄 자기소개 */}
						<S.WideInfoWrapper>
							{formState.errors?.introduce ? (
								<S.ErrorMessage>{formState.errors?.introduce?.message}</S.ErrorMessage>
							) : (
								<S.Label htmlFor="Introduce">한 줄 자기소개 ({introduceCnt}/50)</S.Label>
							)}
							<S.WideInput
								{...register('introduce', {
									required: {
										value: true,
										message: '한줄 자기소개를 입력해주세요',
									},
									maxLength: {
										value: 50,
										message: '50자 이내로 작성해주세요',
									},
								})}
							/>
						</S.WideInfoWrapper>
						<S.InputWrapper>
							{formState.errors?.name ? (
								<S.ErrorMessage>{formState.errors?.name?.message}</S.ErrorMessage>
							) : (
								<S.Label htmlFor="Introduce">이름</S.Label>
							)}
							<S.FullInput
								{...register('name', {
									required: {
										value: true,
										message: '이름을 입력해주세요',
									},
									pattern: {
										value: /^[가-힣]{2,6}$/,
										message: '올바른 이름을 입력해주세요',
									},
								})}
							/>
						</S.InputWrapper>
						<S.InputWrapper>
							{formState.errors?.birth ? (
								<S.ErrorMessage>{formState.errors?.birth?.message}</S.ErrorMessage>
							) : (
								<S.Label htmlFor="Introduce">생년월일</S.Label>
							)}
							<S.FullInput
								{...register('birth', {
									required: {
										value: true,
										message: '생년월일을 입력해주세요',
									},
									pattern: {
										value: /^[0-9]{8}$/,
										message: '유효한 생년월일이 아니에요',
									},
								})}
							/>
						</S.InputWrapper>
						<S.InputWrapper>
							{formState.errors?.height ? (
								<S.ErrorMessage>{formState.errors?.height?.message}</S.ErrorMessage>
							) : (
								<S.Label htmlFor="Introduce">키</S.Label>
							)}
							<S.FullInput
								{...register('height', {
									required: {
										value: true,
										message: '키를 입력해주세요',
									},
									pattern: {
										value: /^[0-9]{3}$/,
										message: '유효한 키가 아니에요',
									},
								})}
							/>
						</S.InputWrapper>
					</S.Content>
					{isModal && (
						<Modal onCloseModal={onCloseModal} width={23.8} height={16.8}>
							<S.ModalMessageWrapper>
								<S.ModalMessage>수정한 프로필로 승인을 요청할까요?</S.ModalMessage>
							</S.ModalMessageWrapper>
							<S.ModalBtnWrapper>
								<S.PrevBtn onClick={onCloseModal}>취소</S.PrevBtn>
								<S.NextBtn type="submit">네</S.NextBtn>
							</S.ModalBtnWrapper>
						</Modal>
					)}
					<BigButton onClick={handleEdit}>수정했어요</BigButton>
				</S.Form>
			</WrapperInner>

			<SideBar status="home" />
		</Wrapper>
	);
};

export default WaitFailEdit;
