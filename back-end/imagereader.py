# ---------------- IMAGEREADER ----------------
def readimage(matrix):
    print("importing for imagereader")
    from PIL import Image
    import pytesseract
    import requests
    from io import BytesIO
    from scraper import scrapeinsta
    print("imported for imagereader")
    for i, row in enumerate(matrix):
        for j, element in enumerate(row):
            if j == 1:
                response = requests.get(matrix[i][j])
                image = Image.open(BytesIO(response.content))
                print("converting image to b&w")
                image = image.convert("L")
                print("reading an image")
                text = pytesseract.image_to_string(image)
                print("image text: " + text)
                matrix[i].append(text)
    return matrix
# ---------------- IMAGEREADER ----------------