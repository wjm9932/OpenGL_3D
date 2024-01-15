////////////////////////////////////////////////////////////////////////
// A small library of 4x4 matrix operations needed for graphics
// transformations.  glm::mat4 is a 4x4 float matrix class with indexing
// and printing methods.  A small list or procedures are supplied to
// create Rotate, Scale, Translate, and Perspective matrices and to
// return the product of any two such.

#include <iostream>

#include <glm/glm.hpp>

#include "math.h"
#include "transform.h"

float* Pntr(glm::mat4& M)
{
    return &(M[0][0]);
}

//@@ The following procedures should calculate and return 4x4
//transformation matrices instead of the identity.

// Return a rotation matrix around an axis (0:X, 1:Y, 2:Z) by an angle
// measured in degrees.  NOTE: Make sure to convert degrees to radians
// before using sin and cos.  HINT: radians = degrees*PI/180
const float pi = 3.14159f;
glm::mat4 Rotate(const int i, const float theta)
{
    glm::mat4 R;

    const float radian = theta * pi / 180;
    const int axis = i % 3;

    if (axis == 0) // X axis
    {
        R[1][1] = cos(radian);
        R[2][1] = -sin(radian);
        R[1][2] = sin(radian);
        R[2][2] = cos(radian);
    }
    else if (axis % 3 == 1) // Y axis
    {
        R[0][0] = cos(radian);
        R[2][0] = sin(radian);
        R[0][2] = -sin(radian);
        R[2][2] = cos(radian);
    }
    else // Z axis
    {
        R[0][0] = cos(radian);
        R[1][0] = -sin(radian);
        R[0][1] = sin(radian);
        R[1][1] = cos(radian);
    }

    return R;
}

// Return a scale matrix
glm::mat4 Scale(const float x, const float y, const float z)
{
    glm::mat4 S;
    S[0][0] = x;
    S[1][1] = y;
    S[2][2] = z;
    return S;
}

// Return a translation matrix
glm::mat4 Translate(const float x, const float y, const float z)
{
    glm::mat4 T;

    T[3][0] = x;
    T[3][1] = y;
    T[3][2] = z;

    return T;
}

// Returns a perspective projection matrix
glm::mat4 Perspective(const float rx, const float ry,
    const float front, const float back)
{
    glm::mat4 P;
    P[0][0] = 1 / rx;
    P[1][1] = 1 / ry;
    P[2][2] = -(back + front) / (back - front);
    P[3][2] = -(2 * front * back) / (back - front);
    P[2][3] = -1;
    P[3][3] = 0;

    return P;
}


