import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import NotFound from "./NotFound";
import "./index.css";
import { getSortedPlacesByUserLocation } from "./location.js";
import NearbyPage from "./NearbyPage";
import BunnyImage from "./Bunny.png";
function App() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNearby, setShowNearby] = useState(false);
  const [sortedPlaces, setSortedPlaces] = useState([]);
  const [likedPlaces, setLikedPlaces] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [searchInput, setSearchInput] = useState(""); // 입력창
  const [searchKeyword, setSearchKeyword] = useState(""); // 실제 검색
  console.log("isModalOpen", isModalOpen);

  // 데이터 가져오기
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:3000/places");
        const data = await response.json();
        console.log("받은 데이터 확인", data);

        // 1. 별점을 낚아채서 추가하는 과정
        const placesWithStars = data.places.map((place) => {
          const randomRating = (Math.random() * (5 - 3) + 3).toFixed(1);
          return { ...place, rating: randomRating };
        });

        // 2. 가공된 데이터를 상태에 저장 (성공했을 때만 딱 한 번!)

        setPlaces(placesWithStars);
      } catch (error) {
        console.log("에러 발생!", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:3000/users/places");
        const data = await response.json();
        console.log("받은 데이터 확인", data);
        setLikedPlaces(data.places);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);

  // 1. 토끼 아이콘 부품(컴포넌트) 만들기
  const RabbitIcon = () => (
    <svg
      viewBox="0 0 24 24" // 원본 캔버스 크기
      fill="currentColor" // Tailwind text 컬러를 따르도록 설정
      className="w-5 h-5 text-yellow-400 inline-block mr-1" // ⭐ 크기, 색상, 간격 조절
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
    </svg>
  );

  const handleDelete = async () => {
    try {
      await fetch(`http://localhost:3000/users/places/${selectedId}`, {
        method: "DELETE",
      });
      console.log("삭제 성공");
      setLikedPlaces((prev) => prev.filter((p) => p.id !== selectedId));
      setIsModalOpen(false);
      setSelectedId(null);
    } catch (error) {
      console.error("삭제 실패", error);
    }
  };

  // 근처 맛집 정렬
  function handleNearbyClick() {
    getSortedPlacesByUserLocation(
      places,
      (sorted) => {
        setSortedPlaces(sorted);
        setShowNearby(true);
      },
      (error) => console.error(error),
    );
  }

  // 찜하기 post 요청
  const handleLike = async (id) => {
    console.log("보내는 id", id);
    try {
      const liked = places.find((p) => p.id === id);
      if (!liked) {
        console.error("해당 id의 맛집을 찾을 수 없음");
        return;
      }

      const response = await fetch("http://localhost:3000/users/places", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ place: liked }),
      });

      const result = await response.json();
      console.log("찜 성공", result);
      setLikedPlaces((prev) => [...prev, liked]);
    } catch (error) {
      console.error("찜 실패", error);
    }
  };

  const displayPlaces = showNearby ? sortedPlaces : places;

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-pink-50">
        <p className="text-center text-xl font-semibold">
          맛집을 불러오는 중입니다...
        </p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/nearby" element={<NearbyPage places={sortedPlaces} />} />

      <Route
        path="/"
        element={
          <div className="min-h-screen bg-pink-50">
            {/* 배너 */}
            <div
              className="w-full h-[300px] bg-[radial-gradient(circle,_#FFB6D9_0%,_#FDA5D5_70%)] flex flex-col items-center justify-center
            
  relative 
  

  after:content-[''] 
  after:absolute 
  after:bottom-0 after:left-0 
  after:w-full after:h-4 
  after:bg-[#FFE3F1]
  after:border-t-2 after:border-[#FFB6D9] 
  after:shadow-inner
"
            >
              <img
                className="w-32 h-32 min-h-[128px] object-contain mb-[-10px]"
                src={BunnyImage}
              />

              <h1 className="text-[#C6005C] text-3xl font-bold mt-0">
                맛집 탐방 사이트
              </h1>
              {/* 검색 + 버튼 */}
              <div className="mt-6 flex items-center justify-center gap-2">
                <input
                  className="px-5 py-3 w-80 rounded-full border border-gray-300 outline-none"
                  placeholder="맛집을 검색해보세요"
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setSearchKeyword(e.target.value);
                  }}
                />

                <button
                  onClick={() => setSearchKeyword(searchInput)}
                  className="bg-rose-200 px-4 py-2 rounded-full text-black"
                >
                  검색
                </button>

                <button
                  onClick={handleNearbyClick}
                  className="bg-emerald-400 text-white px-3 py-2 rounded"
                >
                  근처 맛집
                </button>
              </div>
            </div>

            {/*  콘텐츠 영역 */}
            <div className="p-4 max-w-[1200px] mx-auto">
              {/* 1. 찜한 맛집 섹션 (데이터가 있을 때만 렌더링) */}
              {likedPlaces.length > 0 && (
                <section className="mb-12">
                  <h1 className="text-xl font-bold mb-4 text-[#C6005C]">
                    찜한 맛집 (최대 4개)
                  </h1>

                  {/*  찜 바구니: 한 줄에 4개씩 (grid-cols-4) */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {likedPlaces.slice(0, 4).map((maps) => (
                      <div
                        key={maps.id}
                        className="border rounded-xl p-3 shadow-sm bg-white"
                      >
                        <img
                          src={`http://localhost:3000/${maps.image.src}`}
                          alt={maps.image.alt}
                          className="w-full h-32 object-cover rounded-lg mb-2"
                        />
                        <h2 className="font-bold truncate text-sm">
                          {maps.title}
                        </h2>
                        <h2 className="text-zinc-500 font-bold">#{maps.tag}</h2>
                        {/* 찜한 목록에서 별점*/}
                        <RabbitIcon />
                        <div className="flex item-center gap-1 mt1">
                          <span>{maps.rating}</span>
                          <span className="text-xs text-right">
                            {maps.district}
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedId(maps.id);
                            setIsModalOpen(true);
                          }}
                          className="mt-2 w-full bg-red-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-red-600 transition-colors"
                        >
                          삭제
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* 2. 전체 맛집 섹션 */}
              <section>
                <h2 className="text-xl font-bold mt-6 mb-4">전체 맛집</h2>

                {/* 전체 바구니: 한 줄에 3개씩 (grid-cols-3) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {displayPlaces
                    .filter(
                      (place) => !likedPlaces.some((l) => l.id === place.id),
                    )
                    .filter((place) =>
                      place.title
                        .toLowerCase()
                        .includes(searchKeyword.toLowerCase()),
                    )
                    .slice(0, 6)
                    .map((place) => (
                      <div
                        key={place.id}
                        className="border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col"
                      >
                        <img
                          src={`http://localhost:3000/${place.image.src}`}
                          alt={place.image.alt}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4 flex flex-col flex-grow">
                          <h2 className="font-bold text-lg mb-1">
                            {place.title}
                          </h2>
                          <h3 className="text-zinc-500">#{place.tag}</h3>
                          <span className="text-xs text-right">
                            {place.district}
                          </span>
                          <div>
                            {/* 별 놓을곳*/}
                            <RabbitIcon />
                            <span>{place.rating}</span>
                          </div>

                          <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                            {place.description}
                          </p>
                          <button
                            onClick={() => handleLike(place.id)}
                            className="w-full bg-pink-500 text-white px-3 py-2 rounded-xl font-bold hover:bg-blue-600 transition-colors"
                          >
                            찜하기
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </section>
            </div>
            {/*  모달 */}
            {isModalOpen && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-xl shadow-lg text-center w-80">
                  <p className="mb-4 text-lg font-semibold">
                    삭제하시겠습니까?
                  </p>

                  <div className="flex justify-center gap-4">
                    <button
                      onClick={handleDelete}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    >
                      삭제
                    </button>

                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="bg-gray-300 px-4 py-2 rounded-lg"
                    >
                      취소
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
