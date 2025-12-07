# ---------------- IMAGEREADER ----------------
def readimage(matrix):
    print("importing for imagereader")
    from PIL import Image
    import easyocr
    import numpy as np
    import requests
    from io import BytesIO
    from scraper import scrapeinsta

    print("imported for imagereader")

    # Initialize EasyOCR ONCE
    reader = easyocr.Reader(["en"], gpu=False)

    for i, row in enumerate(matrix):
        for j, element in enumerate(row):
            if j == 1:
                response = requests.get(matrix[i][j])
                image = Image.open(BytesIO(response.content))

                print("converting image to b&w")
                image = image.convert("L")

                print("reading an image")
                result = reader.readtext(np.array(image), detail=0)
                text = " ".join(result)

                print("image text: " + text)
                matrix[i].append(text)

    return matrix
# ---------------- IMAGEREADER ----------------