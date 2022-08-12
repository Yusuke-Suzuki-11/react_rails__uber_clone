import { Fragment, useEffect } from 'react';
import { fetchRestaurants } from '../apis/restaurants';
import styled from 'styled-components';


import MainLogo from '../images/logo.png';
import MainCoverImage from '../images/main-cover-image.png';

const HeaderWrapper = styled.div`
    display: flex;
    justify-content: flex-start;
    padding: 8px 32px;
`;

const MainLogoImage = styled.img`
    height: 90px;
`

const MainCoverImageWrapper = styled.div`
    text-align: center;
`;

const MainCover = styled.img`
    height: 600px;
`;



export const Restaurants = () => {

    useEffect(() => {
        fetchRestaurants().then((data) => console.log(data));
    },
        []
    );

    return (
        <Fragment>
            レストラン一覧
        </Fragment>
    )
}