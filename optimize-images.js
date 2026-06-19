import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const imagesDir = './images';

async function optimizeImages() {
  try {
    const files = fs.readdirSync(imagesDir);
    console.log(`Encontrados ${files.length} archivos en la carpeta images/`);

    for (const file of files) {
      const filePath = path.join(imagesDir, file);
      const ext = path.extname(file).toLowerCase();
      const stats = fs.statSync(filePath);
      
      // Solo optimizar archivos mayores a 500 KB y de tipo imagen (.png, .jpg, .jpeg)
      if (stats.size > 200 * 1024 && (ext === '.png' || ext === '.jpg' || ext === '.jpeg')) {
        console.log(`\nOptimizando: ${file} (Tamaño actual: ${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
        
        const tempPath = path.join(imagesDir, `temp_${file}`);
        
        let sh = sharp(filePath);
        const metadata = await sh.metadata();
        
        // Redimensionar si es muy grande (máximo 1920px de ancho/alto)
        // Para el hero principal nosotros.html (bruno-08.jpg) permitimos hasta 2560px
        const maxDimension = file.includes('bruno-08') ? 2560 : 1920;
        
        if (metadata.width > maxDimension || metadata.height > maxDimension) {
          console.log(`- Redimensionando de ${metadata.width}x${metadata.height} a max ${maxDimension}px`);
          sh = sh.resize({
            width: metadata.width > metadata.height ? maxDimension : undefined,
            height: metadata.height > metadata.width ? maxDimension : undefined,
            fit: 'inside',
            withoutEnlargement: true
          });
        }
        
        if (ext === '.png') {
          // Convertir renders grandes de PNG a JPEG pero conservar el nombre/extensión .png
          // para no tener que cambiar todos los HTML, o simplemente comprimir como PNG optimizado.
          // Espera, un PNG comprimido con sharp sigue pesando bastante si tiene gradientes.
          // Si guardamos formato JPEG en un archivo .png, algunos servidores/navegadores lo leen bien,
          // pero es mejor guardarlo como un PNG muy optimizado (con paleta de 256 colores/pngquant) 
          // o renombrarlo. Para ser limpios y correctos, comprimamos el PNG con calidad 80 y compresión nivel 9.
          await sh.png({ quality: 80, compressionLevel: 9 }).toFile(tempPath);
        } else {
          await sh.jpeg({ quality: 80, mozjpeg: true }).toFile(tempPath);
        }
        
        // Reemplazar original con el optimizado
        fs.unlinkSync(filePath);
        fs.renameSync(tempPath, filePath);
        
        const newStats = fs.statSync(filePath);
        console.log(`- ¡Optimizado! Nuevo tamaño: ${(newStats.size / 1024).toFixed(2)} KB (Reducción: ${(((stats.size - newStats.size) / stats.size) * 100).toFixed(1)}%)`);
      } else {
        console.log(`Saltando: ${file} (Tamaño: ${(stats.size / 1024).toFixed(2)} KB - ya óptimo)`);
      }
    }
    console.log('\n¡Todas las imágenes han sido optimizadas exitosamente!');
  } catch (error) {
    console.error('Error optimizando imágenes:', error);
  }
}

optimizeImages();
