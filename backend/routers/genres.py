from fastapi import APIRouter

from ..crud import list_genres

router = APIRouter(tags=["genres"])


@router.get("/")
def genres():
    result = list_genres()
    return {"genres": result}
